import { useEffect, useRef } from "react";

type Weather = "clear" | "storm" | "fog" | "sunset" | "night";

interface Props {
  weather?: Weather;
  intensity?: "cinematic" | "calm";
  className?: string;
}

interface Entity {
  x: number;
  y: number;
  scale: number;
  speed: number;
  kind: "carrier" | "destroyer" | "frigate" | "sub" | "support" | "civil";
}

const PALETTES: Record<Weather, { sky: [string, string]; sea: [string, string]; haze: string; sun: string }> = {
  clear: { sky: ["#0b2b45", "#1d5c86"], sea: ["#0d3552", "#061b2c"], haze: "rgba(140,200,255,0.06)", sun: "rgba(255,220,150,0.35)" },
  sunset: { sky: ["#2a1a3a", "#c4643a"], sea: ["#3a2337", "#0d1622"], haze: "rgba(255,170,110,0.10)", sun: "rgba(255,180,90,0.5)" },
  storm: { sky: ["#0a1420", "#22303c"], sea: ["#0a1e2c", "#04101a"], haze: "rgba(120,140,160,0.10)", sun: "rgba(180,200,220,0.12)" },
  fog: { sky: ["#16242f", "#41586a"], sea: ["#132531", "#08151d"], haze: "rgba(200,215,225,0.18)", sun: "rgba(220,230,240,0.2)" },
  night: { sky: ["#050b16", "#0d1c33"], sea: ["#05121f", "#020a12"], haze: "rgba(80,120,180,0.07)", sun: "rgba(160,190,255,0.18)" },
};

export function OceanScene({ weather = "clear", intensity = "cinematic", className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const pal = PALETTES[weather];
    const ships: Entity[] = [
      { x: 0.62, y: 0.56, scale: 1.5, speed: 0.0035, kind: "carrier" },
      { x: 0.2, y: 0.62, scale: 0.9, speed: 0.006, kind: "destroyer" },
      { x: 0.85, y: 0.68, scale: 0.75, speed: -0.005, kind: "frigate" },
      { x: 0.42, y: 0.74, scale: 0.6, speed: 0.004, kind: "sub" },
      { x: 0.08, y: 0.82, scale: 0.85, speed: 0.007, kind: "support" },
      { x: 0.7, y: 0.86, scale: 0.4, speed: -0.003, kind: "civil" },
    ];
    const clouds = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random(),
      y: 0.05 + Math.random() * 0.25,
      s: 0.5 + Math.random() * 1.2,
      v: 0.0004 + Math.random() * 0.0008,
      k: i,
    }));
    const aircraft: { x: number; y: number; v: number; type: "jet" | "heli" | "missile" | "gull" }[] = [];
    const blasts: { x: number; y: number; t: number; big: boolean }[] = [];
    const rain = Array.from({ length: weather === "storm" ? 220 : 0 }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.012 + Math.random() * 0.02,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawShip = (e: Entity, t: number) => {
      const px = e.x * w;
      const bob = Math.sin(t * 0.001 + e.x * 10) * 2 * e.scale;
      const py = e.y * h + bob;
      const s = e.scale * Math.max(0.55, w / 1200);
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(e.speed < 0 ? -s : s, s);
      ctx.fillStyle = weather === "night" ? "rgba(8,16,28,0.95)" : "rgba(10,22,34,0.88)";
      ctx.beginPath();
      switch (e.kind) {
        case "carrier":
          ctx.moveTo(-120, 0);
          ctx.lineTo(120, 0);
          ctx.lineTo(105, 16);
          ctx.lineTo(-100, 16);
          ctx.closePath();
          ctx.fill();
          ctx.fillRect(-118, -10, 236, 10);
          ctx.fillRect(20, -34, 22, 26);
          ctx.fillRect(28, -52, 4, 20);
          break;
        case "destroyer":
          ctx.moveTo(-70, 0);
          ctx.lineTo(70, 0);
          ctx.lineTo(58, 12);
          ctx.lineTo(-58, 12);
          ctx.closePath();
          ctx.fill();
          ctx.fillRect(-16, -22, 30, 22);
          ctx.fillRect(-4, -40, 6, 20);
          break;
        case "frigate":
          ctx.moveTo(-52, 0);
          ctx.lineTo(52, 0);
          ctx.lineTo(42, 10);
          ctx.lineTo(-42, 10);
          ctx.closePath();
          ctx.fill();
          ctx.fillRect(-10, -18, 22, 18);
          break;
        case "sub":
          ctx.ellipse(0, 4, 46, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-6, -14, 14, 16);
          break;
        case "support":
          ctx.moveTo(-58, 0);
          ctx.lineTo(58, 0);
          ctx.lineTo(48, 14);
          ctx.lineTo(-48, 14);
          ctx.closePath();
          ctx.fill();
          ctx.fillRect(24, -20, 24, 20);
          break;
        case "civil":
          ctx.moveTo(-22, 0);
          ctx.lineTo(22, 0);
          ctx.lineTo(16, 7);
          ctx.lineTo(-16, 7);
          ctx.closePath();
          ctx.fill();
          ctx.fillRect(-4, -10, 8, 10);
          break;
      }
      ctx.restore();
      // wake
      ctx.fillStyle = "rgba(200,230,255,0.10)";
      ctx.fillRect(px - 90 * s, py + 12 * s, 180 * s, 2);
    };

    const render = (t: number) => {
      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.62);
      sky.addColorStop(0, pal.sky[0]);
      sky.addColorStop(1, pal.sky[1]);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.62);

      // sun rays
      const cx = w * 0.72;
      const cy = h * 0.16;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.7);
      g.addColorStop(0, pal.sun);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h * 0.8);

      if (weather === "night") {
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        for (let i = 0; i < 60; i++) {
          const sx = ((i * 137.5) % 100) / 100 * w;
          const sy = ((i * 73.3) % 45) / 100 * h;
          ctx.globalAlpha = 0.2 + 0.5 * Math.abs(Math.sin(t * 0.0005 + i));
          ctx.fillRect(sx, sy, 1.4, 1.4);
        }
        ctx.globalAlpha = 1;
      }

      // clouds
      for (const c of clouds) {
        c.x += reduced ? 0 : c.v;
        if (c.x > 1.25) c.x = -0.25;
        const px = c.x * w;
        const py = c.y * h;
        ctx.fillStyle = weather === "storm" ? "rgba(30,44,58,0.85)" : "rgba(255,255,255,0.09)";
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.ellipse(px + i * 42 * c.s, py + Math.sin(i) * 8, 52 * c.s, 20 * c.s, 0, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // sea
      const sea = ctx.createLinearGradient(0, h * 0.55, 0, h);
      sea.addColorStop(0, pal.sea[0]);
      sea.addColorStop(1, pal.sea[1]);
      ctx.fillStyle = sea;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      // waves
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        const base = h * (0.58 + layer * 0.1);
        ctx.moveTo(0, base);
        for (let x = 0; x <= w; x += 12) {
          const y =
            base +
            Math.sin((x * 0.012) + t * 0.0009 * (layer + 1)) * (3 + layer * 2) +
            Math.sin(x * 0.03 + t * 0.0015) * 1.6;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = `rgba(120,190,235,${0.035 + layer * 0.012})`;
        ctx.fill();
      }

      // distant smoke columns
      ctx.fillStyle = "rgba(60,70,80,0.25)";
      [0.14, 0.55, 0.9].forEach((fx, i) => {
        const bx = fx * w;
        for (let k = 0; k < 6; k++) {
          const yy = h * 0.55 - k * 14 - Math.sin(t * 0.0008 + i + k) * 4;
          ctx.beginPath();
          ctx.ellipse(bx + Math.sin(t * 0.0006 + k) * 8, yy, 10 + k * 3, 6 + k * 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ships
      for (const s of ships) {
        if (!reduced) {
          s.x += s.speed * 0.0016;
          if (s.x > 1.2) s.x = -0.2;
          if (s.x < -0.2) s.x = 1.2;
        }
        drawShip(s, t);
      }

      // aircraft spawns
      if (intensity === "cinematic" && !reduced && Math.random() < 0.006 && aircraft.length < 5) {
        const types = ["jet", "heli", "missile", "gull"] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        aircraft.push({ x: Math.random() < 0.5 ? -0.1 : 1.1, y: 0.1 + Math.random() * 0.3, v: (Math.random() < 0.5 ? 1 : -1) * (type === "jet" ? 0.006 : type === "missile" ? 0.008 : 0.0018), type });
      }
      for (let i = aircraft.length - 1; i >= 0; i--) {
        const a = aircraft[i];
        a.x += a.v;
        if (a.x < -0.2 || a.x > 1.2) {
          aircraft.splice(i, 1);
          continue;
        }
        const px = a.x * w;
        const py = a.y * h + Math.sin(t * 0.004 + i) * (a.type === "heli" ? 3 : 1);
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(a.v < 0 ? -1 : 1, 1);
        ctx.fillStyle = a.type === "gull" ? "rgba(240,245,250,0.6)" : "rgba(12,20,30,0.9)";
        if (a.type === "jet") {
          ctx.beginPath();
          ctx.moveTo(-14, 0);
          ctx.lineTo(12, 0);
          ctx.lineTo(2, 5);
          ctx.lineTo(-4, 2);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "rgba(255,180,90,0.35)";
          ctx.fillRect(-30, 0, 16, 1.6);
        } else if (a.type === "heli") {
          ctx.fillRect(-10, -2, 18, 5);
          ctx.fillRect(-16, 0, 10, 2);
          ctx.fillRect(-14, -7, 28, 1.4);
        } else if (a.type === "missile") {
          ctx.fillRect(-8, 0, 12, 2.5);
          ctx.fillStyle = "rgba(255,150,80,0.5)";
          ctx.fillRect(-34, 0.4, 26, 1.6);
        } else {
          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.quadraticCurveTo(0, -4, 6, 0);
          ctx.quadraticCurveTo(0, -1, -6, 0);
          ctx.fill();
        }
        ctx.restore();
      }

      // horizon blasts
      if (intensity === "cinematic" && !reduced && Math.random() < 0.004) {
        blasts.push({ x: Math.random(), y: 0.5 + Math.random() * 0.06, t: 0, big: Math.random() < 0.3 });
      }
      for (let i = blasts.length - 1; i >= 0; i--) {
        const b = blasts[i];
        b.t += 0.02;
        if (b.t > 1) {
          blasts.splice(i, 1);
          continue;
        }
        const r = (b.big ? 46 : 24) * b.t;
        const bg = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, r);
        bg.addColorStop(0, `rgba(255,230,160,${0.9 * (1 - b.t)})`);
        bg.addColorStop(0.5, `rgba(255,140,60,${0.6 * (1 - b.t)})`);
        bg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(b.x * w, b.y * h, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // rain
      if (rain.length) {
        ctx.strokeStyle = "rgba(180,210,235,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const d of rain) {
          d.y += d.v;
          d.x += 0.002;
          if (d.y > 1) {
            d.y = -0.05;
            d.x = Math.random();
          }
          ctx.moveTo(d.x * w, d.y * h);
          ctx.lineTo(d.x * w - 4, d.y * h + 12);
        }
        ctx.stroke();
      }

      // haze
      ctx.fillStyle = pal.haze;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [weather, intensity]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
