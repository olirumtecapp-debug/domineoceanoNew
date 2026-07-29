import { useEffect, useRef } from "react";

import { paint, registerFx, spawn, step, type Particle } from "@/game/fx";

interface Props {
  boardId: string;
  size: number;
  className?: string;
}

/** Canvas overlay that renders explosions, splashes and scan pulses on a board. */
export function FxCanvas({ boardId, size, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const unregister = registerFx(boardId, (cell, kind) => {
      const cx = ((cell % size) + 0.5) * (w / size);
      const cy = (Math.floor(cell / size) + 0.5) * (h / size);
      const batch = spawn(kind, cx, cy, cell);
      particles.push(...(reduced ? batch.slice(0, 6) : batch));
      if (particles.length > 900) particles = particles.slice(-900);
    });

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      if (particles.length) {
        particles = particles.filter((p) => {
          const alive = step(p);
          if (alive) paint(ctx, p);
          return alive;
        });
        ctx.globalCompositeOperation = "source-over";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      unregister();
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [boardId, size]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
