import { fleetForSize } from "./fleet";
import { idx, xy } from "./engine";
import type { CellKnowledge, Difficulty, PlayerState, Terrain } from "./types";

interface AiMemory {
  /** cells the human attacked, to model his patterns (Almirante) */
  enemyShots: number[];
}

export function createAiMemory(): AiMemory {
  return { enemyShots: [] };
}

function neighbours(size: number, i: number) {
  const { x, y } = xy(size, i);
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ]
    .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size)
    .map(([nx, ny]) => idx(size, nx, ny));
}

function availableCells(size: number, terrain: Terrain[], k: CellKnowledge[]) {
  const out: number[] = [];
  for (let i = 0; i < size * size; i++) {
    if (terrain[i] !== "water") continue;
    if (k[i].shot) continue;
    out.push(i);
  }
  return out;
}

/** Cells that were hit but belong to ships not yet sunk. */
function openHits(size: number, k: CellKnowledge[], defender: PlayerState) {
  const sunkCells = new Set(defender.ships.filter((s) => s.sunk).flatMap((s) => s.cells));
  const hits: number[] = [];
  for (let i = 0; i < size * size; i++) {
    if (k[i].shot && k[i].result === "hit" && !sunkCells.has(i)) hits.push(i);
  }
  return hits;
}

function remainingShipSizes(defender: PlayerState) {
  return defender.ships.filter((s) => !s.sunk).map((s) => s.size);
}

/** Probability heatmap: for each remaining ship length, count valid placements. */
function heatmap(size: number, terrain: Terrain[], k: CellKnowledge[], defender: PlayerState) {
  const heat = new Array(size * size).fill(0);
  const sizes = remainingShipSizes(defender);
  const blocked = (i: number) => terrain[i] !== "water" || (k[i].shot && k[i].result !== "hit");
  for (const len of sizes) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        for (const o of ["h", "v"] as const) {
          const cells: number[] = [];
          let fits = true;
          for (let c = 0; c < len; c++) {
            const cx = o === "h" ? x + c : x;
            const cy = o === "v" ? y + c : y;
            if (cx >= size || cy >= size) {
              fits = false;
              break;
            }
            const i = idx(size, cx, cy);
            if (blocked(i)) {
              fits = false;
              break;
            }
            cells.push(i);
          }
          if (!fits) continue;
          const hitBonus = cells.filter((c) => k[c].shot && k[c].result === "hit").length;
          const weight = 1 + hitBonus * 12 + len * 0.4;
          for (const c of cells) if (!k[c].shot) heat[c] += weight;
        }
      }
    }
  }
  // revealed cells are gold
  for (let i = 0; i < heat.length; i++) {
    if (k[i].revealedShip && !k[i].shot) heat[i] += 500;
  }
  return heat;
}

function pickMax(heat: number[], pool: number[]) {
  let best = pool[0];
  let bestV = -1;
  for (const i of pool) {
    if (heat[i] > bestV) {
      bestV = heat[i];
      best = i;
    }
  }
  return best;
}

export interface AiDecision {
  type: "shot" | "ability";
  index: number;
  ability?: "radar" | "sonar" | "missile";
}

export function aiDecide(
  difficulty: Difficulty,
  size: number,
  terrain: Terrain[],
  ai: PlayerState,
  human: PlayerState,
): AiDecision {
  const k = ai.knowledge;
  const pool = availableCells(size, terrain, k);
  if (!pool.length) return { type: "shot", index: 0 };
  const rand = () => pool[Math.floor(Math.random() * pool.length)];

  // Smoke reduces accuracy: sometimes forced random shot
  if (human.smokeTurns > 0 && Math.random() < 0.45) return { type: "shot", index: rand() };

  if (difficulty === "muito_facil") {
    return { type: "shot", index: rand() };
  }

  const hits = openHits(size, k, human);

  // --- target mode: extend a known hit line
  if (hits.length) {
    // try to continue an aligned pair first
    for (const h of hits) {
      for (const n of neighbours(size, h)) {
        if (!hits.includes(n)) continue;
        const dx = (n % size) - (h % size);
        const dy = Math.floor(n / size) - Math.floor(h / size);
        const candidates = [
          { x: (n % size) + dx, y: Math.floor(n / size) + dy },
          { x: (h % size) - dx, y: Math.floor(h / size) - dy },
        ];
        for (const c of candidates) {
          if (c.x < 0 || c.y < 0 || c.x >= size || c.y >= size) continue;
          const i = idx(size, c.x, c.y);
          if (pool.includes(i)) return { type: "shot", index: i };
        }
      }
    }
    const around = hits.flatMap((h) => neighbours(size, h)).filter((i) => pool.includes(i));
    if (around.length) {
      if (difficulty === "facil") return { type: "shot", index: around[Math.floor(Math.random() * around.length)] };
      const heat = heatmap(size, terrain, k, human);
      return { type: "shot", index: pickMax(heat, around) };
    }
  }

  if (difficulty === "facil") return { type: "shot", index: rand() };

  // --- abilities for higher levels
  if ((difficulty === "dificil" || difficulty === "especialista" || difficulty === "almirante") && !hits.length) {
    if (ai.cooldowns.radar === 0 && Math.random() < 0.5) {
      const heat = heatmap(size, terrain, k, human);
      return { type: "ability", ability: "radar", index: pickMax(heat, pool) };
    }
    if (difficulty === "almirante" && ai.cooldowns.sonar === 0 && Math.random() < 0.5) {
      const heat = heatmap(size, terrain, k, human);
      return { type: "ability", ability: "sonar", index: pickMax(heat, pool) };
    }
  }

  const heat = heatmap(size, terrain, k, human);

  if (difficulty === "normal") {
    // top-5 random among best
    const sorted = [...pool].sort((a, b) => heat[b] - heat[a]).slice(0, 5);
    return { type: "shot", index: sorted[Math.floor(Math.random() * sorted.length)] };
  }

  const minLen = Math.min(...remainingShipSizes(human).filter(Boolean), 5) || 2;
  let searchPool = pool;
  if (difficulty === "especialista" || difficulty === "almirante") {
    const parity = pool.filter((i) => ((i % size) + Math.floor(i / size)) % Math.max(2, Math.min(minLen, 3)) === 0);
    if (parity.length) searchPool = parity;
  }
  return { type: "shot", index: pickMax(heat, searchPool) };
}

/** Placement smarter for higher difficulties: avoid touching edges/clusters. */
export function aiPlacementQuality(difficulty: Difficulty) {
  return difficulty === "almirante" || difficulty === "especialista" ? "spread" : "any";
}

export function fleetSizeFor(size: number) {
  return fleetForSize(size).length;
}
