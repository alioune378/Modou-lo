import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/hooks';

/**
 * Airborne sand: a few dozen warm, slow particles drifting through the stadium light.
 * Lightweight canvas, paused when off-screen or tab hidden, disabled for reduced motion.
 */
export function SandParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const count = window.innerWidth < 700 ? 26 : 60;
    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };
    let ps: P[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      vx: Math.random() * 0.25 + 0.05,
      vy: -(Math.random() * 0.18 + 0.02),
      a: Math.random() * 0.5 + 0.15,
      tw: Math.random() * Math.PI * 2,
    });
    resize();
    ps = Array.from({ length: count }, spawn);

    let raf = 0;
    let running = true;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.x > w + 4 || p.y < -4) {
          Object.assign(p, spawn(), { x: Math.random() * w * 0.6, y: h + 2 });
        }
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.fillStyle = `rgba(233, 199, 123, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting && !document.hidden;
      if (vis && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!vis) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={ref} className="sand" aria-hidden="true" />;
}
