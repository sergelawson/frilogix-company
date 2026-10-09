import { Mesh, Object3D, Vector3, type MeshBasicMaterial } from 'three';
import { approach, defineScene, easeInOutCubic, easeOutQuint, PAPER, progress, roundedBox, roundedRect } from '../runtime';

/**
 * Services: "from interface to infrastructure to intelligence" as a stack of
 * plates, top to bottom: interface, backend, platform (ink) and intelligence
 * (glass). They start exploded and settle into one stack; then a request drops
 * through every layer and back, and rests on top. Highlighting a plate slides
 * it part way out of the stack, like a drawer. Callouts: one per plate, top
 * to bottom.
 */

const SIZE = 1.5;
const THICKNESS = 0.13;
/** Vertical distance between plates, assembled and exploded. */
const SPACING = 0.38;
const EXPLODED = 0.56;
/** Exploded plates are also nudged sideways (x, z) and turned (radians). */
const DRIFT = [
    [-0.14, 0.08, 0.32],
    [0.12, -0.08, -0.22],
    [-0.1, -0.1, 0.18],
    [0.12, 0.1, -0.28],
];

const ASSEMBLE_MS = 1400;
const STAGGER_MS = 110;
const SETTLED_MS = ASSEMBLE_MS + STAGGER_MS * 3;
/** The request's trip: down to the bottom plate, a pause, and back up. */
const TRIP_DOWN_MS = 1100;
const TRIP_PAUSE_MS = 250;
const TRIP_UP_MS = 900;
const TRIP_START = SETTLED_MS + 150;
const TRIP_END = TRIP_START + TRIP_DOWN_MS + TRIP_PAUSE_MS + TRIP_UP_MS;

/** How far a highlighted plate slides out, toward the viewer's right. */
const PULL = 0.34;
const REQUEST_RADIUS = 0.055;

export default defineScene(PAPER, (kit) => {
    const plateGeometry = roundedBox(SIZE, SIZE, THICKNESS, 0.12, 0.035);
    plateGeometry.rotateX(-Math.PI / 2); // lie flat: thickness along y
    const silhouette = roundedRect(SIZE, SIZE, 0.12).getPoints(6);

    const restY = (i: number) => (1.5 - i) * SPACING;
    const top = (y: number) => y + THICKNESS / 2;

    const plates = [0, 1, 2, 3].map((i) => {
        const mesh = new Mesh(plateGeometry, i === 3 ? kit.glass() : kit.ink());
        // Each plate shadows the one below (or, for the last, the paper under the stack).
        const shadow = kit.shadow(silhouette, 2.2, i === 3 ? '#0b6577' : '#00171f', i === 3 ? 0.18 : 0.22);
        shadow.rotation.x = -Math.PI / 2;
        // Callout dot on the plate's right-hand corner, as the stack is turned 45°.
        const anchor = new Object3D();
        anchor.position.set(0.6, THICKNESS / 2, -0.6);
        mesh.add(anchor);
        kit.root.add(shadow, mesh);
        return { mesh, shadow, anchor, pull: 0, delay: (3 - i) * STAGGER_MS };
    });

    // The request's path through the stack, and the request itself.
    kit.root.add(kit.dashes([new Vector3(0, 1.05, 0), new Vector3(0, restY(3) - 0.2, 0)], '#007ea7', 0.025));
    const request = new Mesh(roundedBox(REQUEST_RADIUS * 2, REQUEST_RADIUS * 2, REQUEST_RADIUS * 2, 0.03, 0.02), kit.signal());
    kit.root.add(request);
    const restingOn = (i: number) => top(restY(i)) + REQUEST_RADIUS + 0.03;
    const entry = 1.05;

    let highlight: number | null = null;

    return {
        // Turned 45° and seen from above, so the plates read as a stack of layers.
        tilt: { x: 0.52, y: -Math.PI / 4 },
        pointerTilt: { x: 0.08, y: 0.18 },
        frame: { width: 2.2, height: 2.35, fillWidth: 0.58, fillHeight: 0.82, shift: -0.17 },
        anchors: plates.map((plate) => plate.anchor),
        setHighlight(index) {
            highlight = index;
        },
        update(elapsed) {
            let moving = elapsed !== null && elapsed < TRIP_END;
            plates.forEach((plate, i) => {
                const t = progress(elapsed, plate.delay, ASSEMBLE_MS);
                const away = 1 - easeOutQuint(t);
                const [dx, dz, turn] = DRIFT[i];
                const target = highlight === i ? 1 : 0;
                plate.pull = kit.reduceMotion ? target : approach(plate.pull, target);
                if (plate.pull !== target) moving = true;
                const y = restY(i) + ((1.5 - i) * EXPLODED - restY(i)) * away;
                // Local +x is toward the viewer's right once the stack is turned 45°.
                plate.mesh.position.set(dx * away + PULL * easeInOutCubic(plate.pull), y, dz * away);
                plate.mesh.rotation.y = turn * away;

                // Shadow on the next plate down, or below the stack.
                const below = i < 3 ? plates[i + 1].mesh.position.y + THICKNESS / 2 + 0.004 : restY(3) - 0.32;
                const gap = y - below;
                plate.shadow.position.set(plate.mesh.position.x + 0.05 + gap * 0.12, below, plate.mesh.position.z + 0.04 + gap * 0.1);
                plate.shadow.rotation.z = plate.mesh.rotation.y;
                plate.shadow.scale.setScalar(1 + gap * 0.25);
                (plate.shadow.material as MeshBasicMaterial).opacity = (i === 3 ? 0.18 : 0.22) / (1 + gap * 2.5);
            });

            // The request: waits above the stack, drops to the bottom plate and
            // comes back up to rest on the top one (and rides along if it slides out).
            let y = entry;
            if (elapsed !== null && elapsed >= TRIP_START) {
                const down = progress(elapsed, TRIP_START, TRIP_DOWN_MS);
                const up = progress(elapsed, TRIP_START + TRIP_DOWN_MS + TRIP_PAUSE_MS, TRIP_UP_MS);
                y = entry + (restingOn(3) - entry) * easeInOutCubic(down);
                if (up > 0) y = restingOn(3) + (restingOn(0) - restingOn(3)) * easeInOutCubic(up);
            }
            const home = elapsed !== null && elapsed >= TRIP_END;
            request.position.set(home ? plates[0].mesh.position.x : 0, home ? restingOn(0) : y, 0);
            return moving;
        },
    };
});
