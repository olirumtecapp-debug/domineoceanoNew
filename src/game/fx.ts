export type FxKind = "explosion" | "splash" | "sunk" | "scan" | "missile";

type Handler = (cell: number, kind: FxKind) => void;

const handlers = new Map<string, Handler>();

export function registerFx(id: string, fn: Handler) {
  handlers.set(id, fn);
  return () => {
    if (handlers.get(id) === fn) handlers.delete(id);
  };
}

/** Trigger a visual effect on a given board at a given cell index. */
export function fx(boardId: string, cell: number, kind: FxKind) {
  handlers.get(boardId)?.(cell, kind);
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  kind: "fire" | "smoke" | "spark" | "water" | "ring" | "debris";
  hue?: number;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export function spawn(kind: FxKind, x: number, y: number, cell: number): Particle[] {
  const out: Particle[] = [];
  const push = (p: Partial<Particle> & Pick<Particle, "kind">) =>
    out.push({ x, y, vx: 0, vy: 0, life: 0, max: 60, size: 4, ...p } as Particle);

  if (kind === "explosion" || kind === "sunk" || kind === "missile") {
    const power = kind === "sunk" ? 1.7 : kind === "missile" ? 1.3 : 1;
    push({ kind: "ring", max: 26 * power, size: 4 });
    for (let i = 0; i < 22 * power; i++) {
      const a = rnd(0, Math.PI * 2);
      const sp = rnd(0.6, 3.4) * power;
      push({
        kind: "fire",
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 0.4,
        life: 0,
        max: rnd(18, 38),
        size: rnd(2, 6) * power,
      });
    }
    for (let i = 0; i < 14 * power; i++) {
      const a = rnd(0, Math.PI * 2);
      push({
        kind: "smoke",
        vx: Math.cos(a) * rnd(0.2, 1.1),
        vy: Math.sin(a) * rnd(0.2, 1.1) - 0.6,
        max: rnd(45, 90),
        size: rnd(4, 11) * power,
      });
    }
    for (let i = 0; i < 10 * power; i++) {
      const a = rnd(0, Math.PI * 2);
      const sp = rnd(2, 6) * power;
      push({ kind: "spark", vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, max: rnd(14, 30), size: rnd(1, 2.2) });
    }
    if (kind === "sunk") {
      for (let i = 0; i < 10; i++) {
        const a = rnd(0, Math.PI * 2);
        push({ kind: "debris", vx: Math.cos(a) * rnd(1, 4), vy: Math.sin(a) * rnd(1, 4), max: rnd(30, 55), size: rnd(2, 4) });
      }
    }
  }

  if (kind === "splash") {
    push({ kind: "ring", max: 22, size: 3 });
    for (let i = 0; i < 20; i++) {
      const a = rnd(-Math.PI, 0);
      const sp = rnd(1, 3);
      push({ kind: "water", vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, max: rnd(20, 40), size: rnd(1.5, 3.5) });
    }
  }

  if (kind === "scan") {
    push({ kind: "ring", max: 44, size: 2, hue: 190 });
    for (let i = 0; i < 10; i++) {
      const a = rnd(0, Math.PI * 2);
      push({ kind: "spark", vx: Math.cos(a) * rnd(0.4, 1.4), vy: Math.sin(a) * rnd(0.4, 1.4), max: 34, size: 1.6, hue: 190 });
    }
  }

  void cell;
  return out;
}

export function step(p: Particle) {
  p.life++;
  p.x += p.vx;
  p.y += p.vy;
  if (p.kind === "smoke") {
    p.vy -= 0.02;
    p.vx *= 0.96;
    p.size += 0.22;
  } else if (p.kind === "water" || p.kind === "debris") {
    p.vy += 0.14;
    p.vx *= 0.99;
  } else if (p.kind === "fire") {
    p.vx *= 0.9;
    p.vy = p.vy * 0.9 - 0.06;
  } else if (p.kind === "spark") {
    p.vx *= 0.93;
    p.vy = p.vy * 0.93 + 0.05;
  }
  return p.life < p.max;
}

export function paint(ctx: CanvasRenderingContext2D, p: Particle) {
  const t = p.life / p.max;
  const fade = 1 - t;
  ctx.globalCompositeOperation = p.kind === "smoke" ? "source-over" : "lighter";
  if (p.kind === "ring") {
    const r = 4 + t * 34;
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle =
      p.hue != null ? `hsla(${p.hue},90%,65%,${fade * 0.7})` : `rgba(255,${180 - t * 80},${90 - t * 60},${fade * 0.8})`;
    ctx.lineWidth = 2.4 * fade + 0.4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  let color: string;
  switch (p.kind) {
    case "fire":
      color = `rgba(255,${Math.round(220 - t * 170)},${Math.round(120 - t * 110)},${fade})`;
      break;
    case "smoke":
      color = `rgba(${40 + t * 30},${44 + t * 30},${52 + t * 30},${fade * 0.42})`;
      break;
    case "spark":
      color = p.hue != null ? `hsla(${p.hue},95%,70%,${fade})` : `rgba(255,240,190,${fade})`;
      break;
    case "water":
      color = `rgba(170,225,255,${fade * 0.9})`;
      break;
    default:
      color = `rgba(30,34,40,${fade})`;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(0.4, p.size * (p.kind === "fire" ? fade : 1)), 0, Math.PI * 2);
  ctx.fill();
}
