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

                    if (alpha > 128) {
                        const r = data[index];
                        const g = data[index + 1];
                        const b = data[index + 2];

                        particles.push({
                            x: x,
                            y: y,
                            originX: x,
                            originY: y,
                            color: `rgb(${r},${g},${b})`,
                            vx: 0,
                            vy: 0,
                            size: Math.random() * 2 + 1
                        });
                    }
                }
            }
        };

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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

                // Draw
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.fillRect(p.x, p.y, p.size, p.size); // Rect is faster than arc
            }

            animationFrameId = requestAnimationFrame(update);
        };

        // Event Listeners
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        const handleResize = () => {
            init();
        };

        // Only animate once the image is ready and while the canvas is on
        // screen — on the one-page site it stays mounted behind every page.
        let loaded = false;
        let visible = false;
        const run = () => {
            cancelAnimationFrame(animationFrameId);
            if (loaded && visible) animationFrameId = requestAnimationFrame(update);
        };
        const handleLoad = () => {
            if (loaded) return;
            loaded = true;
            init();
            run();
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            run();
        });

        image.onload = handleLoad;

        // In case image is already cached
        if (image.complete) handleLoad();

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);
        observer.observe(container);

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={containerRef} className={`w-full relative flex items-center justify-center ${className}`}>
            <canvas ref={canvasRef} className="cursor-crosshair" />
        </div>
    );
};

export default ImageParticles;
