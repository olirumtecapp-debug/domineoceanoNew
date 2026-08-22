import { a as fleetForSize, r as MAPS } from "./fleet-BFcBnVZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-DF6RRqDJ.js
function idx(size, x, y) {
	return y * size + x;
}
function xy(size, i) {
	return {
		x: i % size,
		y: Math.floor(i / size)
	};
}
function coordLabel(size, i) {
	const { x, y } = xy(size, i);
	return `${String.fromCharCode(65 + x)}${y + 1}`;
}
function mulberry32(seed) {
	return function() {
		seed |= 0;
		seed = seed + 1831565813 | 0;
		let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function generateTerrain(size, map, seed = 1) {
	const rnd = mulberry32(seed * 7919 + size * 31);
	const cells = new Array(size * size).fill("water");
	const conf = MAPS.find((m) => m.key === map);
	const pool = {
		mar_aberto: [],
		arquipelago: [
			"island",
			"island",
			"buoy"
		],
		vulcanica: [
			"rock",
			"island",
			"rock"
		],
		costa: [
			"rock",
			"lighthouse",
			"rock"
		],
		polar: ["island", "rock"],
		tropical: [
			"buoy",
			"rig",
			"island"
		]
	}[map];
	if (!pool.length) return cells;
	let placed = 0;
	let guard = 0;
	while (placed < conf.obstacles && guard++ < 500) {
		const i = Math.floor(rnd() * cells.length);
		const { x, y } = xy(size, i);
		if (cells[i] !== "water") continue;
		if ([
			[x + 1, y],
			[x - 1, y],
			[x, y + 1],
			[x, y - 1]
		].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size).some(([nx, ny]) => cells[idx(size, nx, ny)] !== "water")) continue;
		cells[i] = pool[Math.floor(rnd() * pool.length)];
		placed++;
	}
	return cells;
}
function emptyKnowledge(size) {
	return Array.from({ length: size * size }, () => ({ shot: false }));
}
function shipCells(size, start, len, o) {
	const { x, y } = xy(size, start);
	const cells = [];
	for (let k = 0; k < len; k++) {
		const cx = o === "h" ? x + k : x;
		const cy = o === "v" ? y + k : y;
		if (cx >= size || cy >= size) return null;
		cells.push(idx(size, cx, cy));
	}
	return cells;
}
function canPlace(size, terrain, ships, cells) {
	const taken = new Set(ships.flatMap((s) => s.cells));
	return cells.every((c) => terrain[c] === "water" && !taken.has(c));
}
function makeShip(def, cells) {
	return {
		id: `${def.key}-${cells[0]}-${Math.random().toString(36).slice(2, 7)}`,
		key: def.key,
		name: def.name,
		size: def.size,
		armor: def.armor,
		cells,
		damage: cells.map(() => 0),
		sunk: false
	};
}
function autoPlaceFleet(size, terrain) {
	for (let attempt = 0; attempt < 60; attempt++) {
		const ships = [];
		let ok = true;
		for (const def of fleetForSize(size)) {
			let placed = false;
			for (let t = 0; t < 400; t++) {
				const o = Math.random() < .5 ? "h" : "v";
				const cells = shipCells(size, Math.floor(Math.random() * size * size), def.size, o);
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
function createPlayer(name, size, ships) {
	return {
		name,
		ships,
		incoming: emptyKnowledge(size),
		knowledge: emptyKnowledge(size),
		cooldowns: {
			radar: 0,
			sonar: 0,
			airstrike: 0,
			missile: 0,
			smoke: 0,
			repair: 0,
			drone: 0
		},
		smokeTurns: 0
	};
}
/** Applies a shot from attacker onto defender. Mutates copies must be handled by caller. */
function resolveShot(defender, terrain, index) {
	if (terrain[index] !== "water") return {
		index,
		result: "blocked"
	};
	const ship = defender.ships.find((s) => s.cells.includes(index));
	if (!ship) return {
		index,
		result: "miss"
	};
	const pos = ship.cells.indexOf(index);
	ship.damage[pos] = Math.min(ship.armor, ship.damage[pos] + 1);
	const cellDown = ship.damage[pos] >= ship.armor;
	if (ship.damage.every((d) => d >= ship.armor)) ship.sunk = true;
	return {
		index,
		result: ship.sunk ? "sunk" : cellDown ? "hit" : "damaged",
		ship
	};
}
/** A cell can still be targeted while it was only damaged (armored sections). */
function cellOpen(k) {
	return !k.shot || k.result === "damaged";
}
function allSunk(p) {
	return p.ships.length > 0 && p.ships.every((s) => s.sunk);
}
function remainingSections(p) {
	return p.ships.reduce((acc, s) => acc + s.damage.filter((d) => d < s.armor).length, 0);
}
function totalSections(p) {
	return p.ships.reduce((acc, s) => acc + s.size, 0);
}
function shipsAlive(p) {
	return p.ships.filter((s) => !s.sunk).length;
}
/** Compares fleet integrity (0-100) of both sides. */
function advantage(me, foe) {
	const delta = remainingSections(me) / Math.max(1, totalSections(me)) - remainingSections(foe) / Math.max(1, totalSections(foe));
	if (delta > .08) return "winning";
	if (delta < -.08) return "losing";
	return "even";
}
//#endregion
export { cellOpen as a, generateTerrain as c, remainingSections as d, resolveShot as f, xy as g, totalSections as h, canPlace as i, idx as l, shipsAlive as m, allSunk as n, coordLabel as o, shipCells as p, autoPlaceFleet as r, createPlayer as s, advantage as t, makeShip as u };
