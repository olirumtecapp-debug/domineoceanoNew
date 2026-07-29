import { fleetForSize, MAPS } from "./fleet";
import type {
  CellKnowledge,
  MapKey,
  Orientation,
  PlayerState,
  Ship,
  ShotResult,
  Terrain,
} from "./types";

export function idx(size: number, x: number, y: number) {
  return y * size + x;
}
export function xy(size: number, i: number) {
  return { x: i % size, y: Math.floor(i / size) };
}
export function coordLabel(size: number, i: number) {
  const { x, y } = xy(size, i);
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateTerrain(size: number, map: MapKey, seed = 1): Terrain[] {
  const rnd = mulberry32(seed * 7919 + size * 31);
  const cells: Terrain[] = new Array(size * size).fill("water");
  const conf = MAPS.find((m) => m.key === map)!;
  const kinds: Record<MapKey, Terrain[]> = {
    mar_aberto: [],
    arquipelago: ["island", "island", "buoy"],
    vulcanica: ["rock", "island", "rock"],
    costa: ["rock", "lighthouse", "rock"],
    polar: ["island", "rock"],
    tropical: ["buoy", "rig", "island"],
  };
  const pool = kinds[map];
  if (!pool.length) return cells;
  let placed = 0;
  let guard = 0;
  while (placed < conf.obstacles && guard++ < 500) {
    const i = Math.floor(rnd() * cells.length);
    const { x, y } = xy(size, i);
    // keep obstacles away from a fully blocking cluster
    if (cells[i] !== "water") continue;
    const neighbours = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size);
    if (neighbours.some(([nx, ny]) => cells[idx(size, nx, ny)] !== "water")) continue;
    cells[i] = pool[Math.floor(rnd() * pool.length)];
    placed++;
  }
  return cells;
}

export function emptyKnowledge(size: number): CellKnowledge[] {
  return Array.from({ length: size * size }, () => ({ shot: false }));
}

export function shipCells(size: number, start: number, len: number, o: Orientation): number[] | null {
  const { x, y } = xy(size, start);
  const cells: number[] = [];
  for (let k = 0; k < len; k++) {
    const cx = o === "h" ? x + k : x;
    const cy = o === "v" ? y + k : y;
    if (cx >= size || cy >= size) return null;
    cells.push(idx(size, cx, cy));
  }
  return cells;
}

export function canPlace(
  size: number,
  terrain: Terrain[],
  ships: Ship[],
  cells: number[],
): boolean {
  const taken = new Set(ships.flatMap((s) => s.cells));
  return cells.every((c) => terrain[c] === "water" && !taken.has(c));
}

export function makeShip(def: { key: Ship["key"]; name: string; size: number; armor: number }, cells: number[]): Ship {
  return {
    id: `${def.key}-${cells[0]}-${Math.random().toString(36).slice(2, 7)}`,
    key: def.key,
    name: def.name,
    size: def.size,
    armor: def.armor,
    cells,
    damage: cells.map(() => 0),
    sunk: false,
  };
}

export function autoPlaceFleet(size: number, terrain: Terrain[]): Ship[] {
  for (let attempt = 0; attempt < 60; attempt++) {
    const ships: Ship[] = [];
    let ok = true;
    for (const def of fleetForSize(size)) {
      let placed = false;
      for (let t = 0; t < 400; t++) {
        const o: Orientation = Math.random() < 0.5 ? "h" : "v";
        const start = Math.floor(Math.random() * size * size);
        const cells = shipCells(size, start, def.size, o);
        if (!cells) continue;
        if (!canPlace(size, terrain, ships, cells)) continue;
        ships.push(makeShip(def, cells));
        placed = true;
        break;
      }
      if (!placed) {
        ok = false;
        break;
      }
    }
    if (ok) return ships;
  }
  return [];
}

export function createPlayer(name: string, size: number, ships: Ship[]): PlayerState {
  return {
    name,
    ships,
    incoming: emptyKnowledge(size),
    knowledge: emptyKnowledge(size),
    cooldowns: { radar: 0, sonar: 0, airstrike: 0, missile: 0, smoke: 0, repair: 0, drone: 0 },
    smokeTurns: 0,
  };
}

export interface FireOutcome {
  index: number;
  result: ShotResult;
  ship?: Ship;
}

/** Applies a shot from attacker onto defender. Mutates copies must be handled by caller. */
export function resolveShot(defender: PlayerState, terrain: Terrain[], index: number): FireOutcome {
  if (terrain[index] !== "water") return { index, result: "blocked" };
  const ship = defender.ships.find((s) => s.cells.includes(index));
  if (!ship) return { index, result: "miss" };
  const pos = ship.cells.indexOf(index);
  ship.damage[pos] = Math.min(ship.armor, ship.damage[pos] + 1);
  const destroyed = ship.damage.every((d, i2) => d >= ship.armor && i2 >= 0);
  if (destroyed) ship.sunk = true;
  const cellDown = ship.damage[pos] >= ship.armor;
  return { index, result: ship.sunk ? "sunk" : cellDown ? "hit" : "hit", ship };
}

export function allSunk(p: PlayerState) {
  return p.ships.length > 0 && p.ships.every((s) => s.sunk);
}

export function remainingSections(p: PlayerState) {
  return p.ships.reduce(
    (acc, s) => acc + s.damage.filter((d) => d < s.armor).length,
    0,
  );
}
