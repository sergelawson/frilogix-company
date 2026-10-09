import { Mesh, Object3D, Vector3, type MeshPhysicalMaterial } from 'three';
import { approach, defineScene, easeInOutCubic, easeOutQuint, INK, progress, roundedBox } from '../runtime';

/**
 * AI engineering: "most AI projects stall between prototype and production",
 * drawn. Two slate cliffs and a gap; four glowing glass segments (retrieval,
 * evaluation, guardrails, tracing) rise out of the gap one by one, then the
 * stalled request crosses. Highlighting a segment lifts and brightens it.
 * Callouts: the two cliffs, then the four segments.
 */

/** Top of the deck and the cliffs. */
const DECK = 0.35;
/** Half the gap. */
const SPAN = 1;
/** The cliffs run on past the edges of the frame, so they read as land, not blocks. */
const CLIFF = { width: 4, height: 1, depth: 0.8 };
const JOINT = 0.05;
const SEGMENT = { width: (2 * SPAN - 5 * JOINT) / 4, height: 0.14, depth: 0.7 };

const RISE_MS = 900;
const STAGGER_MS = 220;
const BUILT_MS = STAGGER_MS * 3 + RISE_MS;
const CROSS_START = BUILT_MS + 200;
const CROSS_MS = 1700;

const PACKET = 0.11;
const LIFT = 0.06;
const GLOW = 0.22;

export default defineScene(INK, (kit) => {
    const cliffGeometry = roundedBox(CLIFF.width, CLIFF.height, CLIFF.depth, 0.035, 0.015);
    const cliffs = [-1, 1].map((side) => {
        const mesh = new Mesh(cliffGeometry, kit.slate());
        mesh.position.set(side * (SPAN + CLIFF.width / 2), DECK - CLIFF.height / 2, 0);
        // Callout from the back of the top, so its label clears the request waiting at the edge.
        const anchor = new Object3D();
        anchor.position.set(side * (0.62 - CLIFF.width / 2), CLIFF.height / 2, 0.14 - CLIFF.depth / 2);
        mesh.add(anchor);
        kit.root.add(mesh);
        return { mesh, anchor };
    });

    const segmentGeometry = roundedBox(SEGMENT.width, SEGMENT.height, SEGMENT.depth, 0.022, 0.012);
    const substrateGeometry = roundedBox(SEGMENT.width - 0.025, SEGMENT.depth - 0.045, 0.022, 0.018, 0.005);
    substrateGeometry.rotateX(-Math.PI / 2);
    const segments = [0, 1, 2, 3].map((i) => {
        // Own material, so each can glow on its own.
        const material = kit.glowGlass().clone();
        material.thickness = SEGMENT.height;
        const mesh = new Mesh(segmentGeometry, material);
        const substrate = new Mesh(substrateGeometry, kit.metal());
        substrate.position.y = -SEGMENT.height / 2 + 0.008;
        mesh.add(substrate);
        const x = -SPAN + JOINT + SEGMENT.width / 2 + i * (SEGMENT.width + JOINT);
        // Callout under the front edge, numbered like the columns below.
        const anchor = new Object3D();
        anchor.position.set(0, -SEGMENT.height / 2, SEGMENT.depth / 2);
        mesh.add(anchor);
        kit.root.add(mesh);
        return { mesh, material, anchor, x, lift: 0, glow: GLOW, delay: i * STAGGER_MS, spin: i % 2 ? -1 : 1 };
    });

    // The gap's floor, as a construction line.
    kit.root.add(kit.dashes([new Vector3(-SPAN, DECK - CLIFF.height, 0), new Vector3(SPAN, DECK - CLIFF.height, 0)], '#5b7783'));

    const packet = new Mesh(roundedBox(PACKET, PACKET, PACKET, 0.025, 0.02), kit.chalk());
    const packetShadow = kit.contactShadow(PACKET, PACKET);
    kit.root.add(packetShadow, packet);
    // The request waits at the prototype edge and ends at the production edge.
    const from = -(SPAN + 0.28);
    const to = SPAN + 0.28;

    let highlight: number | null = null;

    return {
        tilt: { x: 0.36, y: -0.3 },
        pointerTilt: { x: 0.08, y: 0.16 },
        frame: { width: 4.6, height: 1.5, fillWidth: 1, fillHeight: 0.6 },
        anchors: [...cliffs.map((cliff) => cliff.anchor), ...segments.map((segment) => segment.anchor)],
        setHighlight(index) {
            highlight = index;
        },
        update(elapsed) {
            let moving = elapsed !== null && elapsed < CROSS_START + CROSS_MS;
            const cross = progress(elapsed, CROSS_START, CROSS_MS);
            const packetX = from + (to - from) * easeInOutCubic(cross);

            segments.forEach((segment, i) => {
                // Waiting in the gap, tilted, then rising into place.
                const away = 1 - easeOutQuint(progress(elapsed, segment.delay, RISE_MS));
                const lift = highlight === i ? LIFT : 0;
                segment.lift = kit.reduceMotion ? lift : approach(segment.lift, lift);
                // Brighter while highlighted, and for a moment as the packet passes over.
                const passing = cross > 0 && cross < 1 ? Math.max(0, 1 - Math.abs(packetX - segment.x) / 0.4) : 0;
                const glow = GLOW + (highlight === i ? 0.25 : 0) + passing * 0.3;
                segment.glow = kit.reduceMotion ? glow : approach(segment.glow, glow, 0.2);
                if (segment.lift !== lift || segment.glow !== glow) moving = true;

                segment.mesh.position.set(segment.x, DECK - SEGMENT.height / 2 - (0.75 + i * 0.06) * away + segment.lift, 0.12 * away);
                segment.mesh.rotation.set(0.6 * away * segment.spin, 0, 0.25 * away * segment.spin);
                (segment.mesh.material as MeshPhysicalMaterial).emissiveIntensity = segment.glow;
            });

            // The request waits on the prototype cliff, then crosses.
            packet.position.set(packetX, DECK + PACKET / 2, 0);
            packetShadow.position.set(packetX, DECK + 0.002, 0);
            return moving;
        },
    };
});
