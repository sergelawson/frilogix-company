import { useEffect, useRef, type FC } from 'react';

interface Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;
    color: string;
    vx: number;
    vy: number;
    size: number;
}

const ImageParticles: FC<{ className?: string }> = ({ className = 'h-96' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        const mouse = { x: -1000, y: -1000, radius: 80 };
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Image to load
        const image = new Image();
        image.src = '/hero-shape.png';

        const init = () => {
            // Set canvas size to match container
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            // Hidden (e.g. the hero's art column below lg): getImageData throws on a 0×0 canvas.
            if (!canvas.width || !canvas.height) return;

            // Draw image to offscreen canvas to read data
            const offscreen = document.createElement('canvas');
            // Maintain aspect ratio, fit within canvas
            const scale = Math.min(canvas.width / image.width, canvas.height / image.height) * 0.8;
            const w = image.width * scale;
            const h = image.height * scale;

            offscreen.width = canvas.width;
            offscreen.height = canvas.height;
            const offCtx = offscreen.getContext('2d');
            if (!offCtx) return;

            // Center the image
            const offsetX = (canvas.width - w) / 2;
            const offsetY = (canvas.height - h) / 2;

            offCtx.drawImage(image, offsetX, offsetY, w, h);

            const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            particles = [];
            const step = 4; // Scan every 4th pixel for performance

            for (let y = 0; y < canvas.height; y += step) {
                for (let x = 0; x < canvas.width; x += step) {
                    const index = (y * canvas.width + x) * 4;
                    const alpha = data[index + 3];
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];

                    // The X itself is white in the image: leave it out, so it reads as a
                    // cut-out through the particles rather than a field of white dots.
                    if (alpha > 128 && Math.min(r, g, b) <= 200) {

                        // Homes nudged off the sampling grid by up to a pixel, so the X keeps
                        // an organic texture rather than settling into a visible lattice.
                        const originX = x + Math.random() * 2 - 1;
                        const originY = y + Math.random() * 2 - 1;
                        particles.push({
                            x: originX,
                            y: originY,
                            originX,
                            originY,
                            color: `rgb(${r},${g},${b})`,
                            vx: 0,
                            vy: 0,
                            size: Math.random() * 2 + 1
                        });
                    }
                }
            }
            // Grouped by colour: the image has a few hundred, so a frame fills a few
            // hundred paths rather than one per particle (~5,000).
            particles.sort((a, b) => (a.color < b.color ? -1 : a.color > b.color ? 1 : 0));
        };

        // Advances the physics one frame and draws it. Returns the fastest
        // particle's speed, so the loop below knows when everything has settled.
        const step = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let fastest = 0;
            let fill = '';
            // Each colour's dots go into one path, filled when the colour changes.
            const flush = () => {
                if (!fill) return;
                ctx.fillStyle = fill;
                ctx.fill();
            };

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Core physics - Scattering
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;

                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance; // Stronger when closer

                // If mouse is close, push away
                if (distance < mouse.radius) {
                    const repulsionStrength = 10; // Adjust for stronger scatter
                    p.vx -= forceDirectionX * force * repulsionStrength;
                    p.vy -= forceDirectionY * force * repulsionStrength;
                }

                // Return to origin (spring force)
                const homeDx = p.originX - p.x;
                const homeDy = p.originY - p.y;

                // Spring stiffness
                const spring = 0.05;
                p.vx += homeDx * spring;
                p.vy += homeDy * spring;

                // Friction to dampen oscillation
                const friction = 0.85;
                p.vx *= friction;
                p.vy *= friction;

                p.x += p.vx;
                p.y += p.vy;
                fastest = Math.max(fastest, Math.abs(p.vx) + Math.abs(p.vy));

                // Draw: round dots. (Squares read as squares once particles settle
                // exactly on their pixel grid, e.g. after the mouse stirs them.)
                if (p.color !== fill) {
                    flush();
                    fill = p.color;
                    ctx.beginPath();
                }
                const radius = p.size * 0.6;
                const cx = p.x + p.size / 2;
                const cy = p.y + p.size / 2;
                ctx.moveTo(cx + radius, cy);
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            }
            flush();

            return fastest;
        };

        // The shape is drawn once and only animated while the mouse stirs it
        // or particles are still springing back. At rest — and on touch
        // screens, where nothing can disturb it — it costs no frames at all.
        // Under reduced motion it never animates.
        let loaded = false;
        let visible = false;
        let looping = false;
        const mouseInside = () => mouse.x > -1000;

        const loop = () => {
            const fastest = step();
            looping = visible && (mouseInside() || fastest > 0.05);
            animationFrameId = looping ? requestAnimationFrame(loop) : 0;
        };
        const startLoop = () => {
            if (looping || !loaded || !visible || reduceMotion) return;
            looping = true;
            animationFrameId = requestAnimationFrame(loop);
        };
        const drawStill = () => {
            cancelAnimationFrame(animationFrameId);
            looping = false;
            if (loaded && visible) step();
        };

        // Event Listeners
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            startLoop();
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        // Rebuilt only when the size really changes: a scrollbar appearing (as the
        // pin adds page height) resized the window by ~15px, which rebuilt the X
        // mid-flight. The canvas is centred, so a few pixels either way don't show.
        const handleResize = () => {
            if (Math.abs(container.clientWidth - canvas.width) < 48 && Math.abs(container.clientHeight - canvas.height) < 48) return;
            init();
            drawStill();
        };
        // On first load the particles fly in from all over the canvas and settle
        // into the X (the Company panel's mark does the same, in 3D).
        const scatter = () => {
            for (const p of particles) {
                p.x = Math.random() * canvas.width;
                p.y = Math.random() * canvas.height;
            }
        };
        const handleLoad = () => {
            if (loaded) return;
            loaded = true;
            init();
            if (!reduceMotion) scatter();
            drawStill();
            startLoop();
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            drawStill();
            startLoop(); // finishes any spring-back left mid-way; stops after one frame if settled
        });

        image.onload = handleLoad;

        // In case image is already cached
        if (image.complete) handleLoad();

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);
        observer.observe(container);

        return () => {
            // A load that lands after unmount (React runs effects twice in dev) mustn't redraw this canvas.
            image.onload = null;
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={containerRef} className={`w-full relative flex items-center justify-center ${className}`}>
            <canvas ref={canvasRef} aria-hidden="true" className="cursor-crosshair" />
        </div>
    );
};

export default ImageParticles;
