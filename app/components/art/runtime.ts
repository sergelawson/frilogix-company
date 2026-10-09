import {
    BackSide,
    BoxGeometry,
    BufferGeometry,
    CanvasTexture,
    Color,
    DirectionalLight,
    DoubleSide,
    ExtrudeGeometry,
    Group,
    HalfFloatType,
    LineDashedMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    NeutralToneMapping,
    NoToneMapping,
    Object3D,
    PerspectiveCamera,
    PlaneGeometry,
    PMREMGenerator,
    RepeatWrapping,
    Scene,
    Shape,
    SRGBColorSpace,
    Vector2,
    Vector3,
    WebGLRenderer,
    WebGLRenderTarget,
    type EulerOrder,
    type Material,
    type Texture,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Shared runtime for the site's 3D drawings (./scenes/*): the Company mark,
 * the Services stack, the AI bridge and the plan. Loaded on demand by Art3D,
 * so three.js never reaches the main bundle or the server.
 *
 * One house style: matte ink for software, frosted glass for AI, soft
 * blurred-silhouette shadows, a slight 3/4 view.
 *
 * Performance, which is what most of this file is about:
 * - All drawings share ONE WebGL context (the engine, below), rendering into
 *   an OffscreenCanvas and handing each frame to their own canvas as an
 *   ImageBitmap (no copy, no wait for the GPU; drawImage stalled ~2.5ms a
 *   frame). The context, the environment map and every shader are set up once
 *   for the whole site instead of once per drawing.
 * - Shaders compile in parallel, off the main thread (`compileAsync`), before
 *   anything is drawn, including the variants three.js otherwise compiles in
 *   the middle of the first frame (the glass's back faces and everything seen
 *   through glass). Compiling them during a render froze the page for ~0.5s.
 * - A scene renders only while something moves (its entrance, a highlight,
 *   or the tilt while the mouse is over it) and only while it is on screen.
 *   At rest it costs no frames.
 */

export interface MountOptions {
    reduceMotion: boolean;
    /** Called after every frame with each callout anchor, in CSS pixels from the canvas' top left, and the canvas' width. */
    onFrame: (anchors: { x: number; y: number }[], width: number) => void;
    /** Called once the entrance has finished. */
    onSettled: () => void;
}

export interface ArtScene {
    /** Plays the entrance (or, under reduced motion, shows the end state). Runs once. */
    assemble(): void;
    setVisible(visible: boolean): void;
    /** Emphasises one part (e.g. the plate for a hovered column), or none. */
    setHighlight(index: number | null): void;
    /** The mouse over the drawing, -1..1 from its centre; null when it leaves. The drawing tilts toward it. */
    point(x: number | null, y?: number): void;
    dispose(): void;
}

export type SceneFactory = (container: HTMLElement, options: MountOptions) => ArtScene;

export interface SceneSpec {
    /** Resting rotation of the root, how far it leans toward the mouse, and the Euler order. */
    tilt: { x: number; y: number; order?: EulerOrder };
    pointerTilt: { x: number; y: number };
    /**
     * What to keep in view (scene units, around the origin), the share of the
     * canvas it may fill, and a sideways shift (share of the canvas width,
     * negative = left) that leaves room for callouts.
     */
    frame: { width: number; height: number; fillWidth: number; fillHeight: number; shift?: number };
    /** Where the callouts attach, in callout order. Add them as children of what they label. */
    anchors: Object3D[];
    /**
     * Poses the scene. `elapsed` is ms since the entrance started: null before
     * it, Infinity under reduced motion. Returns true while anything still moves.
     */
    update(elapsed: number | null): boolean;
    setHighlight?(index: number | null): void;
}

/** Background colours the canvases are painted with; they must match the panel behind them. */
export const PAPER = '#f6f7f7';
export const INK = '#00171f';

export const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** 0..1 progress of a step that starts `delay` ms in and lasts `duration` ms. */
export const progress = (elapsed: number | null, delay: number, duration: number) =>
    elapsed === null ? 0 : clamp01((elapsed - delay) / duration);
/** Moves `current` a step toward `target`; snaps when close. Returns the new value. */
export const approach = (current: number, target: number, rate = 0.15) =>
    Math.abs(target - current) < 1e-4 ? target : current + (target - current) * rate;

/** A closed shape through `points`, each corner rounded by the matching radius, shifted by `-offset`. */
export function roundedShape(points: Vector2[], radii: number[], offset = new Vector2()): Shape {
    const shape = new Shape();
    const n = points.length;
    points.forEach((p, i) => {
        const prev = points[(i - 1 + n) % n];
        const next = points[(i + 1) % n];
        const r = radii[i];
        const a = p.clone().add(prev.clone().sub(p).setLength(r)).sub(offset);
        const b = p.clone().add(next.clone().sub(p).setLength(r)).sub(offset);
        const c = p.clone().sub(offset);
        if (i === 0) shape.moveTo(a.x, a.y);
        else shape.lineTo(a.x, a.y);
        shape.quadraticCurveTo(c.x, c.y, b.x, b.y);
    });
    shape.closePath();
    return shape;
}

/** A rounded rectangle centred on the origin. */
export function roundedRect(width: number, height: number, radius: number): Shape {
    const w = width / 2;
    const h = height / 2;
    const corners = [new Vector2(-w, h), new Vector2(w, h), new Vector2(w, -h), new Vector2(-w, -h)];
    return roundedShape(corners, [radius, radius, radius, radius]);
}

/** Extrudes `shape` along z with rounded front and back edges, centred on z = 0. */
export function slab(shape: Shape, depth: number, bevel: number): ExtrudeGeometry {
    const geometry = new ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel * 0.8,
        bevelSegments: 8,
        curveSegments: 10,
    });
    geometry.translate(0, 0, -depth / 2);
    return geometry;
}

/** A rounded box: width along x, height along y, depth along z, centred on the origin. */
export function roundedBox(width: number, height: number, depth: number, radius: number, bevel = 0.04): ExtrudeGeometry {
    return slab(roundedRect(width - bevel * 1.6, height - bevel * 1.6, radius), depth - bevel * 2, bevel);
}

/** Fine grain for matte materials, so they read as a material rather than flat colour. */
function grainTexture(): CanvasTexture {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const image = ctx.createImageData(size, size);
    for (let i = 0; i < image.data.length; i += 4) {
        const v = 110 + Math.random() * 60;
        image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
        image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    const texture = new CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
}

/**
 * A soft shadow: the silhouette (points around the origin, within a square of
 * side `plane`), blurred, as an alpha map. Cheaper and softer than a shadow
 * map, and it can't streak the paper.
 */
function shadowTexture(silhouette: Vector2[], plane: number): CanvasTexture {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    silhouette.forEach((p, i) => {
        const x = (p.x / plane + 0.5) * size;
        const y = (0.5 - p.y / plane) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.fill();

    // Three box blurs each way approximate a gaussian.
    const image = ctx.getImageData(0, 0, size, size);
    let a = new Float32Array(size * size);
    let b = new Float32Array(size * size);
    for (let i = 0; i < a.length; i++) a[i] = image.data[i * 4];
    const radius = 6;
    for (let pass = 0; pass < 3; pass++) {
        for (const [step, stride] of [
            [1, size],
            [size, 1],
        ]) {
            for (let line = 0; line < size; line++) {
                for (let j = 0; j < size; j++) {
                    let sum = 0;
                    let count = 0;
                    for (let k = Math.max(0, j - radius); k <= Math.min(size - 1, j + radius); k++) {
                        sum += a[line * stride + k * step];
                        count++;
                    }
                    b[line * stride + j * step] = sum / count;
                }
            }
            [a, b] = [b, a];
        }
    }
    for (let i = 0; i < a.length; i++) image.data[i * 4] = image.data[i * 4 + 1] = image.data[i * 4 + 2] = a[i];
    ctx.putImageData(image, 0, 0);
    return new CanvasTexture(canvas);
}

/** Device pixels per CSS pixel the drawings render at: crisp enough for soft 3D, and ~45% cheaper than 2x. */
const MAX_PIXEL_RATIO = 1.5;

/** The materials of the house style. Each call makes a new instance; equal instances share compiled shaders. */
function makeMaterials(grain: Texture) {
    return {
        /** Matte ink: software. */
        ink: () =>
            new MeshStandardMaterial({ color: '#0b2235', roughness: 0.7, bumpMap: grain, bumpScale: 0.6, envMapIntensity: 0.12 }),
        /** Frosted glass on paper: AI. */
        glass: () =>
            new MeshPhysicalMaterial({
                color: '#eefbfc',
                roughness: 0.3,
                transmission: 1,
                thickness: 0.35,
                ior: 1.5,
                attenuationColor: new Color('#5fc3d1'),
                attenuationDistance: 0.5,
                specularIntensity: 1,
                clearcoat: 0.5,
                clearcoatRoughness: 0.35,
                side: DoubleSide, // renders the back faces too, so the inner edges show through
            }),
        /** Frosted glass that glows, for ink panels, where clear glass would only show the dark behind it. */
        glowGlass: () =>
            new MeshPhysicalMaterial({
                color: '#c9f1f4',
                roughness: 0.3,
                transmission: 1,
                thickness: 0.35,
                ior: 1.5,
                attenuationColor: new Color('#5fc3d1'),
                attenuationDistance: 0.6,
                emissive: new Color('#0f6c7a'),
                emissiveIntensity: 0.6,
                specularIntensity: 1,
                clearcoat: 0.6,
                clearcoatRoughness: 0.3,
                side: DoubleSide,
            }),
        /** Matte slate: structure on ink panels. */
        slate: () =>
            new MeshStandardMaterial({ color: '#2c4a56', roughness: 0.72, bumpMap: grain, bumpScale: 0.5, envMapIntensity: 0.35 }),
        /** Matte paper-white: small objects on ink panels. */
        chalk: () => new MeshStandardMaterial({ color: '#dfe8ea', roughness: 0.6, envMapIntensity: 0.6 }),
        /** Teal: the one signal in a drawing. */
        signal: () =>
            new MeshStandardMaterial({
                color: '#1aa3c9',
                roughness: 0.4,
                emissive: new Color('#007ea7'),
                emissiveIntensity: 0.45,
                envMapIntensity: 0.6,
            }),
        shadow: (alphaMap: Texture, color: string, opacity: number) =>
            new MeshBasicMaterial({ color, alphaMap, transparent: true, opacity, depthWrite: false, toneMapped: false }),
        dashes: (color: string, dash: number) =>
            new LineDashedMaterial({ color, dashSize: dash, gapSize: dash * 1.15, toneMapped: false }),
    };
}

/** Key light from the top left (so shadows fall to the bottom right) and a cool rim. Every scene has the same two. */
function addLights(scene: Scene) {
    const key = new DirectionalLight('#ffffff', 2.4);
    key.position.set(-3, 4.5, 6);
    const rim = new DirectionalLight('#dff4f6', 0.7);
    rim.position.set(4, -2, 3);
    scene.add(key, rim);
}

// --- The engine: one WebGL context, environment and shader cache for every drawing. ---

interface Engine {
    renderer: WebGLRenderer;
    /** The studio reflections every material uses; set once `ready`. */
    envMap: Texture | null;
    grain: Texture;
    /** Resolves once every shader the drawings use has compiled. Nothing is drawn before. */
    ready: Promise<void>;
    /** The OffscreenCanvas it draws into, sized to whichever drawing rendered last. */
    canvas: OffscreenCanvas;
    users: number;
    dispose: () => void;
}

let engine: Engine | null = null;
let releaseTimer = 0;

function acquireEngine(): Engine {
    window.clearTimeout(releaseTimer);
    if (engine) {
        engine.users++;
        return engine;
    }
    const canvas = new OffscreenCanvas(1, 1);
    const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = NeutralToneMapping;
    // Frosted glass blurs what's behind it anyway: half-resolution transmission looks the same.
    renderer.transmissionResolutionScale = 0.5;

    const grain = grainTexture();

    // A scene holding one of everything the drawings use, kept for the engine's
    // lifetime so the shaders compiled for it stay cached for theirs.
    const warm = new Scene();
    addLights(warm);
    const materials = makeMaterials(grain);
    const box = new BoxGeometry(0.1, 0.1, 0.1);
    const glasses = [materials.glass(), materials.glowGlass()];
    for (const material of [...glasses, materials.ink(), materials.slate(), materials.chalk(), materials.signal(), materials.shadow(grain, '#000', 0.2)]) {
        warm.add(new Mesh(box, material));
    }
    const line = new LineSegments(new BufferGeometry().setFromPoints([new Vector3(), new Vector3(0, 1, 0)]), materials.dashes('#000', 0.03));
    line.computeLineDistances();
    warm.add(line);

    const compile = async () => {
        // The environment: compiling the room's shaders first, off the main
        // thread, halves the time fromScene() then blocks it.
        const room = new RoomEnvironment();
        await renderer.compileAsync(room, new PerspectiveCamera(90, 1, 0.1, 100));
        const pmrem = new PMREMGenerator(renderer);
        created.envMap = pmrem.fromScene(room, 0.04).texture;
        warm.environment = created.envMap;
        room.dispose();
        pmrem.dispose();

        const camera = new PerspectiveCamera();
        // As drawn on screen.
        const onScreen = renderer.compileAsync(warm, camera);
        // As drawn into the glass pass (WebGLRenderer.renderTransmissionPass): into a
        // render target, without tone mapping, and the glass by its back faces. three.js
        // would otherwise compile these, synchronously, in the middle of the first frame.
        const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType });
        renderer.setRenderTarget(target);
        renderer.toneMapping = NoToneMapping;
        glasses.forEach((glass) => {
            glass.side = BackSide;
            glass.needsUpdate = true;
        });
        const throughGlass = renderer.compileAsync(warm, camera);
        glasses.forEach((glass) => {
            glass.side = DoubleSide;
            glass.needsUpdate = true;
        });
        renderer.toneMapping = NeutralToneMapping;
        renderer.setRenderTarget(null);
        await Promise.all([onScreen, throughGlass]);
        target.dispose();
    };

    const created: Engine = {
        renderer,
        envMap: null,
        grain,
        ready: Promise.resolve(),
        canvas,
        users: 1,
        dispose() {
            warm.traverse((object) => {
                if (object instanceof Mesh || object instanceof LineSegments) {
                    object.geometry.dispose();
                    (object.material as Material).dispose();
                }
            });
            created.envMap?.dispose();
            grain.dispose();
            renderer.dispose();
        },
    };
    // If compiling ahead fails, draw anyway: shaders then compile on first use, as three.js normally does.
    created.ready = compile().catch(() => {});
    engine = created;
    return created;
}

function releaseEngine() {
    if (!engine || --engine.users > 0) return;
    // Kept a moment, so a remount (or React's dev double effects) doesn't rebuild it.
    releaseTimer = window.setTimeout(() => {
        if (!engine || engine.users > 0) return;
        engine.dispose();
        engine = null;
    }, 2000);
}

/** The pieces a scene is built from. Everything created here is disposed with the scene. */
export interface Kit {
    /** The group that tilts. Add the scene's objects here. */
    root: Group;
    reduceMotion: boolean;
    /** Matte ink: software. */
    ink: () => MeshStandardMaterial;
    /** Frosted glass on paper: AI. */
    glass: () => MeshPhysicalMaterial;
    /** Frosted glass that glows, for ink panels, where clear glass would only show the dark behind it. */
    glowGlass: () => MeshPhysicalMaterial;
    /** Matte slate: structure on ink panels. */
    slate: () => MeshStandardMaterial;
    /** Matte paper-white: small objects on ink panels. */
    chalk: () => MeshStandardMaterial;
    /** Teal: the one signal in a drawing. */
    signal: () => MeshStandardMaterial;
    /** A blurred shadow of `silhouette` (centred on the origin, within `plane`), lying on z = 0. */
    shadow: (silhouette: Vector2[], plane: number, color: string, opacity: number) => Mesh<PlaneGeometry, MeshBasicMaterial>;
    /** Dashed construction lines, as pairs of points. */
    dashes: (points: Vector3[], color: string, dash?: number) => LineSegments;
}

/** Builds a scene factory from a scene description. `background` is the panel's colour. */
export function defineScene(background: string, build: (kit: Kit) => SceneSpec): SceneFactory {
    return (container, { reduceMotion, onFrame, onSettled }) => {
        const engine = acquireEngine();
        const { renderer } = engine;

        // The drawing's own canvas, which shows the frames the engine hands it.
        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);
        const context = canvas.getContext('bitmaprenderer')!;

        const scene = new Scene();
        // Painted the panel's colour: glass can only show what's rendered behind it.
        scene.background = new Color(background);
        scene.environmentIntensity = 0.9; // the environment arrives with engine.ready
        addLights(scene);
        const camera = new PerspectiveCamera(22, 1, 0.1, 60);
        const root = new Group();
        scene.add(root);

        const textures: Texture[] = [];
        const materials = makeMaterials(engine.grain);
        const once = <T>(make: () => T) => {
            let value: T | undefined;
            return () => (value ??= make());
        };
        const shadowMaps = new Map<Vector2[], Texture>();

        const kit: Kit = {
            root,
            reduceMotion,
            ink: once(materials.ink),
            glass: once(materials.glass),
            glowGlass: once(materials.glowGlass),
            slate: once(materials.slate),
            chalk: once(materials.chalk),
            signal: once(materials.signal),
            shadow(silhouette, plane, color, opacity) {
                let map = shadowMaps.get(silhouette);
                if (!map) {
                    map = shadowTexture(silhouette, plane);
                    shadowMaps.set(silhouette, map);
                    textures.push(map);
                }
                return new Mesh(new PlaneGeometry(plane, plane), materials.shadow(map, color, opacity));
            },
            dashes(points, color, dash = 0.03) {
                const lines = new LineSegments(new BufferGeometry().setFromPoints(points), materials.dashes(color, dash));
                lines.computeLineDistances();
                return lines;
            },
        };

        const spec = build(kit);
        const base = spec.tilt;
        root.rotation.order = base.order ?? 'XYZ';
        root.rotation.set(base.x, base.y, 0);

        const projected = new Vector3();
        let width = 0;
        let height = 0;
        let ready = false;
        let disposed = false;

        const resize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            if (!width || !height) return;
            const ratio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            camera.aspect = width / height;
            const { frame } = spec;
            const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
            const distance = Math.max(
                frame.height / (frame.fillHeight * 2 * tanHalf),
                frame.width / (frame.fillWidth * 2 * tanHalf * camera.aspect),
            );
            camera.position.set(0, 0, distance);
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
            root.position.x = (frame.shift ?? 0) * 2 * distance * tanHalf * camera.aspect;
        };

        const render = () => {
            if (!ready || !width || !height) return;
            // Resizing reallocates the buffer (~4ms), so only when another drawing used it last.
            if (engine.canvas.width !== canvas.width || engine.canvas.height !== canvas.height) {
                renderer.setSize(canvas.width, canvas.height, false);
            }
            renderer.render(scene, camera);
            context.transferFromImageBitmap(engine.canvas.transferToImageBitmap());
            onFrame(
                spec.anchors.map((anchor) => {
                    anchor.getWorldPosition(projected).project(camera);
                    return { x: ((projected.x + 1) / 2) * width, y: ((1 - projected.y) / 2) * height };
                }),
                width,
            );
        };

        // --- Loop: runs only while the scene moves or the tilt is catching up. ---
        const tilt = { x: base.x, y: base.y };
        const target = { x: base.x, y: base.y };
        let startedAt: number | null = null;
        let settled = false;
        let visible = false;
        let frame = 0;

        const tick = (now: number) => {
            frame = 0;
            const elapsed = startedAt === null ? null : reduceMotion ? Infinity : now - startedAt;
            let moving = spec.update(elapsed);
            if (elapsed !== null && !moving && !settled) {
                settled = true;
                onSettled();
            }
            const dx = target.x - tilt.x;
            const dy = target.y - tilt.y;
            if (Math.abs(dx) + Math.abs(dy) > 1e-4) {
                tilt.x += dx * 0.08;
                tilt.y += dy * 0.08;
                root.rotation.set(tilt.x, tilt.y, 0);
                moving = true;
            }
            render();
            if (moving && visible) frame = requestAnimationFrame(tick);
        };
        const wake = () => {
            if (!frame && visible && ready) frame = requestAnimationFrame(tick);
        };

        const resizeObserver = new ResizeObserver(() => {
            resize();
            render();
        });
        resizeObserver.observe(container);

        // Until assemble() is called the scene waits in its opening pose; it's
        // first drawn once the shaders are ready.
        resize();
        spec.update(null);
        engine.ready.then(() => {
            if (disposed) return;
            scene.environment = engine.envMap;
            ready = true;
            render();
            if (settled) onSettled(); // under reduced motion, once there's a frame to label
            wake();
        });

        return {
            assemble() {
                if (startedAt !== null) return;
                startedAt = performance.now();
                if (reduceMotion) {
                    // Draw the end state now, even if it isn't on screen yet.
                    spec.update(Infinity);
                    settled = true;
                    if (ready) {
                        render();
                        onSettled();
                    }
                    return;
                }
                wake();
            },
            setVisible(next) {
                visible = next;
                if (visible) wake();
                else {
                    cancelAnimationFrame(frame);
                    frame = 0;
                }
            },
            setHighlight(index) {
                spec.setHighlight?.(index);
                if (reduceMotion) {
                    spec.update(Infinity);
                    render();
                } else wake();
            },
            point(x, y = 0) {
                if (reduceMotion || !settled) return;
                target.x = base.x + (x === null ? 0 : y * spec.pointerTilt.x);
                target.y = base.y + (x === null ? 0 : x * spec.pointerTilt.y);
                wake();
            },
            dispose() {
                disposed = true;
                cancelAnimationFrame(frame);
                resizeObserver.disconnect();
                const owned = new Set<Material>();
                scene.traverse((object) => {
                    if (object instanceof Mesh || object instanceof LineSegments) {
                        object.geometry.dispose();
                        for (const material of [object.material].flat()) owned.add(material);
                    }
                });
                owned.forEach((material) => material.dispose());
                textures.forEach((texture) => texture.dispose());
                canvas.remove();
                releaseEngine();
            },
        };
    };
}
