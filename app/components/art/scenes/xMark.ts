import { Group, Mesh, Object3D, Vector2, Vector3, type MeshBasicMaterial } from 'three';
import { defineScene, easeOutQuint, PAPER, progress, roundedShape, slab } from '../runtime';

/**
 * Company: the Frilogix X as four physical arms, matte ink on the left
 * (software) and frosted glass on the right (the AI inside it). They wait
 * scattered, then glide together into the mark. Callouts: top left, top right,
 * bottom right, bottom left.
 */

/** Half the gap between arms, before the bevel eats into it; the gaps form a "+". */
const GAP = 0.085;
/** Arm width where it meets the outer corner and the centre, as a share of the quadrant. */
const OUTER_CUT = 0.56;
const INNER_CUT = 0.28;
const DEPTH = 0.26;
/** Rounded edge, front and back. */
const BEVEL = 0.032;
/** Arms float this far above the paper, so their shadows read. */
const LIFT = 0.1;

const ASSEMBLE_MS = 1500;
const STAGGER_MS = 140;
/** How far apart the arms start: outward along their diagonal, up off the paper, and turned (radians). */
const SCATTER = { out: 0.24, up: 0.2, tilt: 0.25, spin: 0.2 };

/** Where each callout's dot sits on the top-left arm; the other arms are rotations of it. */
const ANCHOR = new Vector2(-0.7, 0.58);

/** The top-left arm: a band along the diagonal, cut square at the outer corner and at the centre. */
function armOutline(): Vector2[] {
    const L = 1 - GAP;
    return [
        new Vector2(-1, 1), // outer corner
        new Vector2(-1 + OUTER_CUT * L, 1),
        new Vector2(-GAP, GAP + INNER_CUT * L),
        new Vector2(-GAP, GAP), // inner corner
        new Vector2(-GAP - INNER_CUT * L, GAP),
        new Vector2(-1, 1 - OUTER_CUT * L),
    ];
}

export default defineScene(PAPER, (kit) => {
    // Dashed construction lines through the gaps, drawn on the paper.
    kit.root.add(
        kit.dashes(
            [new Vector3(0, -1.3, 0.002), new Vector3(0, 1.3, 0.002), new Vector3(-1.3, 0, 0.002), new Vector3(1.3, 0, 0.002)],
            '#7f8f99',
        ),
    );

    // One outline, centred on its own middle so each arm turns about itself while it flies in.
    const outline = armOutline();
    const centre = outline.reduce((sum, p) => sum.add(p), new Vector2()).divideScalar(outline.length);
    const armShape = roundedShape(outline, [0.045, 0.018, 0.018, 0.016, 0.018, 0.018], centre);
    const armGeometry = slab(armShape, DEPTH, BEVEL);
    armGeometry.translate(0, 0, DEPTH / 2 + BEVEL); // back face on z = 0
    const silhouette = armShape.getPoints(6);
    /** Where shadows fall relative to their arm, in root space: down and to the right. */
    const shadowOffset = new Vector2(0.08, -0.11);
    const outward = new Vector2(-1, 1).normalize();

    // Arms in reading order round the mark: top left (ink), top right (glass),
    // bottom right (glass), bottom left (ink): software on the left, AI on the
    // right. Each is the top-left arm turned a quarter further clockwise.
    kit.glass().thickness = DEPTH;
    const arms = [0, 1, 2, 3].map((k) => {
        const pivot = new Group();
        pivot.rotation.z = (-k * Math.PI) / 2;
        const solid = k === 0 || k === 3;
        const mesh = new Mesh(armGeometry, solid ? kit.ink() : kit.glass());
        // A recessed metal back gives the glass a readable silhouette and
        // an internal reflection, even against the light page.
        if (!solid) {
            const backing = new Mesh(armGeometry, kit.metal());
            backing.scale.set(0.96, 0.96, 0.035);
            backing.position.z = 0.015;
            mesh.add(backing);
        }
        // Glass lets light through, so its shadow is lighter and tinted.
        const shadowOpacity = solid ? 0.36 : 0.24;
        const shadow = kit.shadow(silhouette, 1.7, solid ? '#00171f' : '#0b6577', shadowOpacity);
        const anchor = new Object3D();
        anchor.position.set(ANCHOR.x - centre.x, ANCHOR.y - centre.y, DEPTH + 2 * BEVEL);
        mesh.add(anchor);
        // The pivot turns the arm into its quadrant; turn the offset back so every shadow falls the same way.
        const offset = shadowOffset.clone().rotateAround(new Vector2(), (k * Math.PI) / 2);
        pivot.add(shadow, mesh);
        kit.root.add(pivot);
        return { mesh, shadow, shadowOpacity, offset, anchor, spin: solid ? 1 : -1, delay: k * STAGGER_MS };
    });

    return {
        tilt: { x: -0.1, y: -0.24, order: 'YXZ' }, // YXZ keeps the horizontal guide level
        pointerTilt: { x: 0.1, y: 0.16 },
        frame: { width: 2.4, height: 2.3, fillWidth: 0.66, fillHeight: 0.88 },
        anchors: arms.map((arm) => arm.anchor),
        update(elapsed) {
            let moving = false;
            for (const arm of arms) {
                const t = progress(elapsed, arm.delay, ASSEMBLE_MS);
                if (t < 1 && elapsed !== null) moving = true;
                const away = 1 - easeOutQuint(t);
                // Scattered: pulled out along its diagonal, raised and turned, but
                // still inside the frame, since that's how the panel slides in.
                arm.mesh.position.set(
                    centre.x + outward.x * SCATTER.out * away,
                    centre.y + outward.y * SCATTER.out * away,
                    LIFT + SCATTER.up * away,
                );
                arm.mesh.rotation.set(SCATTER.tilt * away * arm.spin, -SCATTER.tilt * 0.8 * away, SCATTER.spin * away * arm.spin);
                // The higher the arm, the further, larger and fainter its shadow.
                const lift = 1 + 2 * away;
                arm.shadow.position.set(arm.mesh.position.x + arm.offset.x * lift, arm.mesh.position.y + arm.offset.y * lift, 0.003);
                arm.shadow.rotation.z = arm.mesh.rotation.z;
                arm.shadow.scale.setScalar(1 + 0.35 * away);
                (arm.shadow.material as MeshBasicMaterial).opacity = arm.shadowOpacity * (1 - 0.6 * away);
            }
            return moving;
        },
    };
});
