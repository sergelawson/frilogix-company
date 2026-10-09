import { Mesh, Object3D, Vector3 } from 'three';
import { defineScene, easeInOutCubic, INK, progress, roundedBox } from '../runtime';

/**
 * The plan: "what survives our products reaches yours". A cloud of
 * experiments (new models and tools) streams into a glowing glass block (our
 * products); most drop out of the bottom, and the few that survive turn teal
 * and land on a slate plinth (your product). It plays once. Callouts: the
 * experiments, our products, your product.
 */

const BLOCK = { x: -0.25, y: 0.05, width: 0.95, height: 0.75, depth: 0.75 };
const PLINTH = { x: 1.25, y: -0.42, width: 0.9, height: 0.32, depth: 0.75 };
const CLOUD = { x: -1.5, y: 0.05 };
const CUBE = 0.12;

/** Cubes launched, in order; the rest stay in the cloud. */
const LAUNCHED = 12;
const COUNT = 16;
/** Launch order of the cubes that make it, and where each lands on the plinth. */
const SURVIVORS = new Map([
    [2, -0.25],
    [7, 0],
    [11, 0.25],
]);

const STAGGER_MS = 130;
const TRIP_MS = 1700;
/** Share of a trip spent reaching the inside of the block. */
const IN = 0.45;

/** Deterministic scatter, so every visit looks the same. */
function random(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
    };
}

export default defineScene(INK, (kit) => {
    const block = new Mesh(roundedBox(BLOCK.width, BLOCK.height, BLOCK.depth, 0.08), kit.glowGlass());
    block.position.set(BLOCK.x, BLOCK.y, 0);
    const plinth = new Mesh(roundedBox(PLINTH.width, PLINTH.height, PLINTH.depth, 0.05), kit.slate());
    plinth.position.set(PLINTH.x, PLINTH.y, 0);
    kit.root.add(block, plinth);

    const cloudAnchor = new Object3D();
    cloudAnchor.position.set(CLOUD.x, CLOUD.y - 0.4, 0.1);
    const blockAnchor = new Object3D();
    blockAnchor.position.set(0, BLOCK.height / 2, BLOCK.depth / 2 - 0.1);
    block.add(blockAnchor);
    const plinthAnchor = new Object3D();
    plinthAnchor.position.set(0, -PLINTH.height / 2, PLINTH.depth / 2);
    plinth.add(plinthAnchor);
    kit.root.add(cloudAnchor);

    const rand = random(7);
    const jitter = (range: number) => (rand() * 2 - 1) * range;
    const cubeGeometry = roundedBox(CUBE, CUBE, CUBE, 0.025, 0.015);
    const plinthTop = PLINTH.y + PLINTH.height / 2 + CUBE / 2;

    const cubes = Array.from({ length: COUNT }, (_, i) => {
        const mesh = new Mesh(cubeGeometry, kit.chalk());
        kit.root.add(mesh);
        const landing = SURVIVORS.get(i);
        const inside = new Vector3(BLOCK.x + jitter(0.28), BLOCK.y + jitter(0.2), jitter(0.18));
        return {
            mesh,
            launched: i < LAUNCHED,
            survives: landing !== undefined,
            start: new Vector3(CLOUD.x + jitter(0.28), CLOUD.y + jitter(0.3), jitter(0.25)),
            spin: new Vector3(jitter(Math.PI), jitter(Math.PI), jitter(Math.PI)),
            inside,
            end:
                landing !== undefined
                    ? new Vector3(PLINTH.x + landing, plinthTop, 0)
                    : new Vector3(inside.x + 0.05 + rand() * 0.15, -1.3, inside.z),
            delay: i * STAGGER_MS,
        };
    });

    const point = new Vector3();
    const arc = new Vector3();

    return {
        tilt: { x: 0.3, y: -0.28 },
        pointerTilt: { x: 0.08, y: 0.16 },
        frame: { width: 3.5, height: 1.5, fillWidth: 0.9, fillHeight: 0.62 },
        anchors: [cloudAnchor, blockAnchor, plinthAnchor],
        update(elapsed) {
            let moving = false;
            for (const cube of cubes) {
                const t = cube.launched ? progress(elapsed, cube.delay, TRIP_MS) : 0;
                if (elapsed !== null && cube.launched && t < 1) moving = true;
                let scale = 1;
                if (t <= IN) {
                    // Into the block, where the glass blurs it.
                    point.lerpVectors(cube.start, cube.inside, easeInOutCubic(t / IN));
                } else {
                    const u = easeInOutCubic((t - IN) / (1 - IN));
                    if (cube.survives) {
                        // Out over the top and down onto the plinth.
                        arc.set((cube.inside.x + cube.end.x) / 2, 0.8, 0);
                        point.lerpVectors(cube.inside, arc, u).lerp(arc.lerp(cube.end, u), u);
                    } else {
                        // Out through the floor, shrinking away.
                        point.lerpVectors(cube.inside, cube.end, u * u);
                        scale = 1 - u;
                    }
                }
                cube.mesh.position.copy(point);
                // Tumbling while in flight; survivors land square.
                const turn = cube.survives ? 1 - t : 1 + t;
                cube.mesh.rotation.set(cube.spin.x * turn, cube.spin.y * turn, cube.spin.z * turn);
                cube.mesh.scale.setScalar(Math.max(scale, 0.0001));
                cube.mesh.material = cube.survives && t > IN ? kit.signal() : kit.chalk();
            }
            return moving;
        },
    };
});
