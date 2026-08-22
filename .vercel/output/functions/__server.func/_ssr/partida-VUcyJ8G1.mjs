import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SupportButton, r as cn, t as Button } from "./SupportButton-D6On0mZE.mjs";
import { P as Cloud, S as Plane, _ as RotateCw, b as Radar, k as House, m as Shuffle, n as VolumeX, o as Trophy, p as Skull, r as Volume2, t as Waves, v as Rocket, x as Play, y as Radio } from "../_libs/lucide-react.mjs";
import { t as FullscreenButton } from "./DeviceButtons-DNvftn9f.mjs";
import { n as SHIP_SPRITES, t as MAP_IMAGES } from "./assets-CoqDvaie.mjs";
import { a as fleetForSize, n as DIFFICULTIES, r as MAPS, t as ABILITIES } from "./fleet-BFcBnVZD.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as OceanScene } from "./OceanScene-C5SirJvV.mjs";
import { a as cellOpen, c as generateTerrain, f as resolveShot, g as xy, i as canPlace, l as idx, m as shipsAlive, n as allSunk, o as coordLabel, p as shipCells, r as autoPlaceFleet, s as createPlayer, u as makeShip } from "./engine-DF6RRqDJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$2 } from "./router-Calv0BAc.mjs";
import { t as audio } from "./audio-DtgDOpK1.mjs";
import { n as Badge, o as recordMatch, r as Progress } from "./profile-BaKPOKKn.mjs";
import { n as Board, r as fx, t as AdvantagePanel } from "./Board-BCXwU8hk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partida-VUcyJ8G1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function neighbours(size, i) {
	const { x, y } = xy(size, i);
	return [
		[x + 1, y],
		[x - 1, y],
		[x, y + 1],
		[x, y - 1]
	].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size).map(([nx, ny]) => idx(size, nx, ny));
}
function availableCells(size, terrain, k) {
	const out = [];
	for (let i = 0; i < size * size; i++) {
		if (terrain[i] !== "water") continue;
		if (!cellOpen(k[i])) continue;
		out.push(i);
	}
	return out;
}
/** Cells that were hit but belong to ships not yet sunk. */
function openHits(size, k, defender) {
	const sunkCells = new Set(defender.ships.filter((s) => s.sunk).flatMap((s) => s.cells));
	const hits = [];
	for (let i = 0; i < size * size; i++) if (k[i].shot && (k[i].result === "hit" || k[i].result === "damaged") && !sunkCells.has(i)) hits.push(i);
	return hits;
}
function remainingShipSizes(defender) {
	return defender.ships.filter((s) => !s.sunk).map((s) => s.size);
}
/** Probability heatmap: for each remaining ship length, count valid placements. */
function heatmap(size, terrain, k, defender) {
	const heat = new Array(size * size).fill(0);
	const sizes = remainingShipSizes(defender);
	const blocked = (i) => terrain[i] !== "water" || k[i].shot && k[i].result !== "hit" && k[i].result !== "damaged";
	for (const len of sizes) for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) for (const o of ["h", "v"]) {
		const cells = [];
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
		const weight = 1 + cells.filter((c) => k[c].shot && (k[c].result === "hit" || k[c].result === "damaged")).length * 12 + len * .4;
		for (const c of cells) if (cellOpen(k[c])) heat[c] += weight;
	}
	for (let i = 0; i < heat.length; i++) if (k[i].revealedShip && cellOpen(k[i])) heat[i] += 500;
	return heat;
}
function pickMax(heat, pool) {
	let best = pool[0];
	let bestV = -1;
	for (const i of pool) if (heat[i] > bestV) {
		bestV = heat[i];
		best = i;
	}
	return best;
}
function aiDecide(difficulty, size, terrain, ai, human) {
	const k = ai.knowledge;
	const pool = availableCells(size, terrain, k);
	if (!pool.length) return {
		type: "shot",
		index: 0
	};
	const rand = () => pool[Math.floor(Math.random() * pool.length)];
	if (human.smokeTurns > 0 && Math.random() < .45) return {
		type: "shot",
		index: rand()
	};
	if (difficulty === "muito_facil") return {
		type: "shot",
		index: rand()
	};
	const hits = openHits(size, k, human);
	if (hits.length) {
		for (const h of hits) for (const n of neighbours(size, h)) {
			if (!hits.includes(n)) continue;
			const dx = n % size - h % size;
			const dy = Math.floor(n / size) - Math.floor(h / size);
			const candidates = [{
				x: n % size + dx,
				y: Math.floor(n / size) + dy
			}, {
				x: h % size - dx,
				y: Math.floor(h / size) - dy
			}];
			for (const c of candidates) {
				if (c.x < 0 || c.y < 0 || c.x >= size || c.y >= size) continue;
				const i = idx(size, c.x, c.y);
				if (pool.includes(i)) return {
					type: "shot",
					index: i
				};
			}
		}
		const around = hits.flatMap((h) => neighbours(size, h)).filter((i) => pool.includes(i));
		if (around.length) {
			if (difficulty === "facil") return {
				type: "shot",
				index: around[Math.floor(Math.random() * around.length)]
			};
			return {
				type: "shot",
				index: pickMax(heatmap(size, terrain, k, human), around)
			};
		}
	}
	if (difficulty === "facil") return {
		type: "shot",
		index: rand()
	};
	if ((difficulty === "dificil" || difficulty === "especialista" || difficulty === "almirante") && !hits.length) {
		if (ai.cooldowns.radar === 0 && Math.random() < .5) return {
			type: "ability",
			ability: "radar",
			index: pickMax(heatmap(size, terrain, k, human), pool)
		};
		if (difficulty === "almirante" && ai.cooldowns.sonar === 0 && Math.random() < .5) return {
			type: "ability",
			ability: "sonar",
			index: pickMax(heatmap(size, terrain, k, human), pool)
		};
	}
	const heat = heatmap(size, terrain, k, human);
	if (difficulty === "normal") {
		const sorted = [...pool].sort((a, b) => heat[b] - heat[a]).slice(0, 5);
		return {
			type: "shot",
			index: sorted[Math.floor(Math.random() * sorted.length)]
		};
	}
	const minLen = Math.min(...remainingShipSizes(human).filter(Boolean), 5) || 2;
	let searchPool = pool;
	if (difficulty === "especialista" || difficulty === "almirante") {
		const parity = pool.filter((i) => (i % size + Math.floor(i / size)) % Math.max(2, Math.min(minLen, 3)) === 0);
		if (parity.length) searchPool = parity;
	}
	return {
		type: "shot",
		index: pickMax(heat, searchPool)
	};
}
var ABILITY_ICONS = {
	radar: Radar,
	sonar: Waves,
	missile: Rocket,
	airstrike: Plane,
	smoke: Cloud,
	drone: Radio
};
function MatchPage() {
	const search = Route$2.useSearch();
	const navigate = useNavigate();
	const size = search.size;
	const map = search.map;
	const difficulty = search.difficulty;
	const terrain = (0, import_react.useMemo)(() => generateTerrain(size, map, size + map.length), [size, map]);
	const fleet = (0, import_react.useMemo)(() => fleetForSize(size), [size]);
	const [, force] = (0, import_react.useState)(0);
	const rerender = (0, import_react.useCallback)(() => force((v) => v + 1), []);
	const state = (0, import_react.useRef)({
		terrain,
		p1: createPlayer("Você", size, []),
		p2: createPlayer("Frota Inimiga", size, autoPlaceFleet(size, terrain)),
		turn: "p1",
		phase: "placing",
		winner: null,
		log: [],
		shots: 0,
		hits: 0,
		sunk: 0,
		taken: 0,
		lostShips: 0,
		turnCount: 0
	});
	const [selectedShipIdx, setSelectedShipIdx] = (0, import_react.useState)(0);
	const [orientation, setOrientation] = (0, import_react.useState)("h");
	const [ability, setAbility] = (0, import_react.useState)(null);
	const [shake, setShake] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const logId = (0, import_react.useRef)(1);
	(0, import_react.useEffect)(() => {
		audio.load();
		setMuted(audio.settings.muted);
		audio.resume();
		return () => audio.stopMusic();
	}, []);
	(0, import_react.useEffect)(() => {
		state.current = {
			terrain,
			p1: createPlayer("Você", size, []),
			p2: createPlayer("Frota Inimiga", size, autoPlaceFleet(size, terrain)),
			turn: "p1",
			phase: "placing",
			winner: null,
			log: [],
			shots: 0,
			hits: 0,
			sunk: 0,
			taken: 0,
			lostShips: 0,
			turnCount: 0
		};
		setSelectedShipIdx(0);
		rerender();
	}, [
		terrain,
		size,
		rerender
	]);
	const s = state.current;
	const placedKeys = s.p1.ships.map((sh) => sh.key);
	fleet.filter((f, i) => !s.p1.ships.some((ps) => ps.id.startsWith(`${f.key}-`) && placedKeys.indexOf(f.key) === i));
	const remainingDefs = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		s.p1.ships.forEach((sh) => counts.set(sh.key, (counts.get(sh.key) ?? 0) + 1));
		const left = [];
		const used = /* @__PURE__ */ new Map();
		for (const def of fleet) {
			const u = used.get(def.key) ?? 0;
			if (u < (counts.get(def.key) ?? 0)) used.set(def.key, u + 1);
			else left.push(def);
		}
		return left;
	}, [fleet, s.p1.ships.length]);
	const pushLog = (who, text, kind) => {
		s.log.unshift({
			id: logId.current++,
			who,
			text,
			kind
		});
		s.log = s.log.slice(0, 40);
	};
	const placeAt = (i) => {
		const def = remainingDefs[Math.min(selectedShipIdx, remainingDefs.length - 1)];
		if (!def) return;
		const cells = shipCells(size, i, def.size, orientation);
		if (!cells || !canPlace(size, terrain, s.p1.ships, cells)) {
			toast.error("Posição inválida para essa embarcação.");
			return;
		}
		s.p1.ships.push(makeShip(def, cells));
		audio.play("click");
		setSelectedShipIdx(0);
		rerender();
	};
	const autoPlace = () => {
		s.p1.ships = autoPlaceFleet(size, terrain);
		audio.play("click");
		rerender();
	};
	const clearPlacement = () => {
		s.p1.ships = [];
		rerender();
	};
	const startBattle = () => {
		if (remainingDefs.length) {
			toast.error("Posicione toda a frota antes de zarpar.");
			return;
		}
		s.phase = "battle";
		pushLog("p1", "Frota posicionada. Combate iniciado!", "info");
		audio.resume();
		audio.startMusic();
		audio.play("siren");
		rerender();
	};
	const endMatch = (winner) => {
		if (s.phase === "over") return;
		s.phase = "over";
		s.winner = winner;
		audio.stopMusic();
		audio.play(winner === "p1" ? "victory" : "defeat");
		recordMatch({
			win: winner === "p1",
			shots: s.shots,
			hits: s.hits,
			sunk: s.sunk,
			difficulty,
			size
		});
	};
	const applyShot = (attacker, index, silent = false) => {
		const atk = attacker === "p1" ? s.p1 : s.p2;
		const def = attacker === "p1" ? s.p2 : s.p1;
		if (!cellOpen(atk.knowledge[index])) return;
		const out = resolveShot(def, terrain, index);
		atk.knowledge[index] = {
			...atk.knowledge[index],
			shot: true,
			result: out.result
		};
		def.incoming[index] = {
			shot: true,
			result: out.result
		};
		if (attacker === "p1") {
			s.shots++;
			if (out.result !== "miss") s.hits++;
		} else if (out.result !== "miss") {
			s.taken++;
			if (out.ship?.sunk) s.lostShips++;
		}
		const label = coordLabel(size, index);
		const board = attacker === "p1" ? "enemy" : "own";
		if (out.result === "miss") {
			if (!silent) audio.play("miss");
			fx(board, index, "splash");
			pushLog(attacker, `${atk.name}: tiro na água em ${label}.`, "miss");
		} else if (out.ship?.sunk) {
			if (attacker === "p1") s.sunk++;
			if (!silent) audio.play("sunk");
			pushLog(attacker, `${out.ship.name} AFUNDADO em ${label}!`, "sunk");
			const left = shipsAlive(def);
			if (attacker === "p1") toast.success(`${out.ship.name} inimigo AFUNDADO! Faltam ${left}.`);
			else toast.error(`Seu ${out.ship.name} foi afundado! Restam ${left}.`);
			setShake(true);
			setTimeout(() => setShake(false), 500);
			out.ship.cells.forEach((c, k) => {
				atk.knowledge[c] = {
					...atk.knowledge[c],
					shot: true,
					result: "sunk"
				};
				def.incoming[c] = {
					shot: true,
					result: "sunk"
				};
				setTimeout(() => fx(board, c, "sunk"), k * 110);
			});
		} else {
			if (!silent) audio.play("hit");
			fx(board, index, "explosion");
			pushLog(attacker, `Impacto confirmado em ${label}!`, "hit");
		}
		if (allSunk(def)) endMatch(attacker);
		return out.result;
	};
	const nextTurn = () => {
		if (s.phase === "over") return;
		const cur = s.turn === "p1" ? s.p1 : s.p2;
		Object.keys(cur.cooldowns).forEach((k) => {
			cur.cooldowns[k] = Math.max(0, cur.cooldowns[k] - 1);
		});
		if (cur.smokeTurns > 0) cur.smokeTurns--;
		s.turnCount++;
		if (allSunk(s.p2)) return endMatch("p1");
		if (allSunk(s.p1)) return endMatch("p2");
		s.turn = s.turn === "p1" ? "p2" : "p1";
	};
	const useAbility = (attacker, key, index) => {
		const atk = attacker === "p1" ? s.p1 : s.p2;
		const def = attacker === "p1" ? s.p2 : s.p1;
		const conf = ABILITIES.find((a) => a.key === key);
		atk.cooldowns[key] = conf.cooldown;
		const { x, y } = xy(size, index);
		const board = attacker === "p1" ? "enemy" : "own";
		if (key === "radar" || key === "sonar" || key === "drone") fx(board, index, "scan");
		switch (key) {
			case "radar": {
				let count = 0;
				for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
					const i = idx(size, nx, ny);
					atk.knowledge[i] = {
						...atk.knowledge[i],
						revealed: true
					};
					if (def.ships.some((sh) => sh.cells.includes(i) && !sh.sunk)) count++;
				}
				audio.play("radar");
				pushLog(attacker, `Radar em ${coordLabel(size, index)}: ${count} seção(ões) detectada(s).`, "ability");
				break;
			}
			case "sonar": {
				const target = Array.from({ length: size }, (_, k) => idx(size, k, y)).find((i) => def.ships.some((sh) => sh.cells.includes(i) && !sh.sunk) && !atk.knowledge[i].shot);
				audio.play("radar");
				if (target !== void 0) {
					atk.knowledge[target] = {
						...atk.knowledge[target],
						revealed: true,
						revealedShip: true
					};
					pushLog(attacker, `Sonar detectou contato em ${coordLabel(size, target)}.`, "ability");
				} else pushLog(attacker, `Sonar na linha ${y + 1}: nenhum contato.`, "ability");
				break;
			}
			case "missile": {
				applyShot(attacker, index);
				const around = [
					[x + 1, y],
					[x - 1, y],
					[x, y + 1],
					[x, y - 1]
				].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size).map(([nx, ny]) => idx(size, nx, ny)).filter((i) => !atk.knowledge[i].shot && terrain[i] === "water");
				if (around.length) applyShot(attacker, around[Math.floor(Math.random() * around.length)]);
				pushLog(attacker, "Míssil guiado disparado!", "ability");
				break;
			}
			case "airstrike":
				pushLog(attacker, "Ataque aéreo autorizado!", "ability");
				for (let dx = -1; dx <= 1; dx++) {
					const nx = x + dx;
					if (nx < 0 || nx >= size) continue;
					const i = idx(size, nx, y);
					if (!atk.knowledge[i].shot && terrain[i] === "water") applyShot(attacker, i, dx !== 0);
				}
				break;
			case "smoke":
				atk.smokeTurns = 2;
				pushLog(attacker, "Cortina de fumaça ativada por 2 turnos.", "ability");
				break;
			case "drone": {
				const around = [];
				for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
					const i = idx(size, nx, ny);
					if (!atk.knowledge[i].shot && !def.ships.some((sh) => sh.cells.includes(i))) around.push(i);
				}
				around.slice(0, 3).forEach((i) => {
					atk.knowledge[i] = {
						...atk.knowledge[i],
						shot: true,
						result: "miss"
					};
				});
				pushLog(attacker, `Drone confirmou ${Math.min(3, around.length)} célula(s) vazia(s).`, "ability");
				break;
			}
		}
	};
	const playerFire = (index) => {
		if (s.phase !== "battle" || s.turn !== "p1") return;
		if (ability) {
			const conf = ABILITIES.find((a) => a.key === ability);
			if (s.p1.cooldowns[ability] > 0) return;
			useAbility("p1", ability, index);
			setAbility(null);
			if (conf.key !== "smoke") {}
			nextTurn();
			rerender();
			return;
		}
		audio.play("shot");
		applyShot("p1", index);
		nextTurn();
		rerender();
	};
	const useSmoke = () => {
		if (s.turn !== "p1" || s.p1.cooldowns.smoke > 0) return;
		useAbility("p1", "smoke", 0);
		nextTurn();
		rerender();
	};
	(0, import_react.useEffect)(() => {
		if (s.phase !== "battle" || s.turn !== "p2" || s.winner) return;
		const timer = setTimeout(() => {
			const decision = aiDecide(difficulty, size, terrain, s.p2, s.p1);
			if (decision.type === "ability" && decision.ability) useAbility("p2", decision.ability, decision.index);
			else {
				audio.play("shot");
				applyShot("p2", decision.index);
			}
			nextTurn();
			rerender();
		}, 750);
		return () => clearTimeout(timer);
	}, [
		s.turn,
		s.phase,
		s.turnCount,
		difficulty,
		size,
		terrain
	]);
	const diffName = DIFFICULTIES.find((d) => d.key === difficulty)?.name ?? "Normal";
	const mapName = MAPS.find((m) => m.key === map)?.name ?? "Mar Aberto";
	const accuracy = s.shots ? Math.round(s.hits / s.shots * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative min-h-screen", shake && "animate-od-shake"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: MAP_IMAGES[map],
				alt: "",
				"aria-hidden": true,
				className: "pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none fixed inset-0 bg-background/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OceanScene, {
				weather: "clear",
				intensity: "calm",
				className: "pointer-events-none fixed inset-0 h-full w-full opacity-20"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto max-w-7xl px-3 py-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl panel-metal px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "ghost",
									size: "sm",
									className: "gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }), " Base"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: ["Cenário: ", mapName]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: [
										size,
										"x",
										size
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-accent text-accent-foreground",
									children: diffName
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportButton, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										audio.settings.muted = !audio.settings.muted;
										audio.apply();
										setMuted(audio.settings.muted);
									},
									children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullscreenButton, {})
							]
						})]
					}),
					s.phase === "placing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-[1fr_320px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl panel-metal p-3 sm:p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
								size,
								terrain,
								knowledge: s.p1.incoming,
								ships: s.p1.ships,
								onCell: placeAt,
								mapKey: map,
								label: "Posicione sua frota"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "rounded-xl panel-metal p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold",
									children: "Frota de Elite"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Escolha uma embarcação, defina a orientação e toque no oceano para posicioná-la."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "secondary",
											onClick: () => setOrientation((o) => o === "h" ? "v" : "h"),
											className: "gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-4 w-4" }),
												" ",
												orientation === "h" ? "Horizontal" : "Vertical"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "secondary",
											onClick: autoPlace,
											className: "gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "h-4 w-4" }), " Auto"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: clearPlacement,
											children: "Limpar"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-4 space-y-2",
									children: [remainingDefs.map((def, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setSelectedShipIdx(i),
										className: cn("w-full rounded-lg border border-border px-3 py-2 text-left transition-colors", i === Math.min(selectedShipIdx, remainingDefs.length - 1) ? "border-primary bg-primary/15" : "hover:bg-muted/40"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: SHIP_SPRITES[def.key],
												alt: "",
												"aria-hidden": true,
												loading: "lazy",
												className: "mb-1 h-8 w-full object-contain object-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-semibold",
													children: def.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "flex gap-[2px]",
													children: Array.from({ length: def.size }, (_, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-[2px] bg-steel" }, k))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-[11px] text-muted-foreground",
												children: [
													def.desc,
													" ",
													def.armor > 1 && `• Blindagem ${def.armor}x`
												]
											})
										]
									}) }, `${def.key}-${i}`)), !remainingDefs.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "rounded-lg border border-primary/50 bg-primary/10 p-3 text-sm",
										children: "Frota completa. Pronto para zarpar, Comandante."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "mt-4 w-full gap-2",
									disabled: remainingDefs.length > 0,
									onClick: startBattle,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), " Iniciar combate"]
								})
							]
						})]
					}),
					s.phase !== "placing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-[1fr_1fr_300px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl panel-metal p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
									size,
									terrain,
									knowledge: s.p1.knowledge,
									onCell: playerFire,
									disabled: s.turn !== "p1" || s.phase === "over",
									boardId: "enemy",
									mapKey: map,
									label: ability ? `Alvo para ${ABILITIES.find((a) => a.key === ability).name}` : "Oceano inimigo — ataque"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-3 gap-2 text-center text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-primary",
												children: s.shots
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Disparos"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-bold text-accent",
												children: [accuracy, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Precisão"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-destructive",
												children: s.sunk
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Afundados"
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl panel-metal p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
									size,
									terrain,
									knowledge: s.p1.incoming,
									ships: s.p1.ships,
									boardId: "own",
									mapKey: map,
									label: "Sua frota"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 space-y-1",
									children: s.p1.ships.map((sh) => {
										const alive = sh.damage.filter((d) => d < sh.armor).length;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("w-32 truncate", sh.sunk && "text-muted-foreground line-through"),
												children: sh.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
												value: alive / sh.size * 100,
												className: "h-1.5 flex-1"
											})]
										}, sh.id);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvantagePanel, {
										me: s.p1,
										foe: s.p2,
										foeName: "Frota inimiga",
										turnNumber: s.turnCount + 1,
										myTurn: s.turn === "p1",
										over: s.phase === "over",
										statusText: s.phase === "over" ? s.winner === "p1" ? "Você venceu!" : "Você foi derrotado" : s.turn === "p1" ? "Suas ordens" : "Inimigo atacando..."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl panel-metal p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-2 text-xs uppercase tracking-widest text-muted-foreground",
											children: "Habilidades"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-2",
											children: ABILITIES.map((a) => {
												const Icon = ABILITY_ICONS[a.key] ?? Radar;
												const cd = s.p1.cooldowns[a.key];
												const active = ability === a.key;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													title: `${a.name} — ${a.desc}`,
													disabled: cd > 0 || s.turn !== "p1" || s.phase === "over",
													onClick: () => a.targeted ? setAbility(active ? null : a.key) : useSmoke(),
													className: cn("rounded-lg border border-border p-2 text-left text-[11px] transition-colors disabled:opacity-40", active ? "border-accent bg-accent/20" : "hover:bg-muted/40"),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mb-1 h-4 w-4 text-primary" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-semibold leading-tight",
															children: a.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-muted-foreground",
															children: cd > 0 ? `Recarga ${cd}` : "Pronto"
														})
													]
												}, a.key);
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl panel-metal p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-2 text-xs uppercase tracking-widest text-muted-foreground",
												children: "Painel de comando"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-2 text-center text-[11px]",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-md bg-muted/40 p-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-base font-bold text-primary",
															children: s.hits
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-muted-foreground",
															children: "Dano causado"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-md bg-muted/40 p-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-base font-bold text-destructive",
															children: s.taken
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-muted-foreground",
															children: "Dano recebido"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-md bg-muted/40 p-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-base font-bold text-accent",
															children: [accuracy, "%"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-muted-foreground",
															children: "Precisão"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-md bg-muted/40 p-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-base font-bold",
															children: [
																s.sunk,
																"/",
																s.lostShips
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-muted-foreground",
															children: "Afundou/Perdeu"
														})]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-3 mb-1 text-[10px] uppercase tracking-widest text-muted-foreground",
												children: "Últimas ordens"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "space-y-1 text-[11px]",
												children: s.log.slice(0, 4).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
													className: cn("truncate rounded px-2 py-1", l.kind === "hit" && "bg-destructive/15", l.kind === "sunk" && "bg-destructive/30 font-semibold", l.kind === "ability" && "bg-primary/15", l.who === "p2" && "text-muted-foreground"),
													children: l.text
												}, l.id))
											})
										]
									})
								]
							})
						]
					}),
					s.phase === "over" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fixed inset-0 z-40 flex items-center justify-center bg-background/85 backdrop-blur",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-[min(92vw,440px)] rounded-2xl panel-metal p-6 text-center animate-od-rise",
							children: [
								s.winner === "p1" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "mx-auto h-12 w-12 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skull, { className: "mx-auto h-12 w-12 text-destructive" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 text-2xl font-black uppercase tracking-widest",
									children: s.winner === "p1" ? "Vitória Naval" : "Frota Perdida"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mx-auto mt-2 w-fit rounded-full border border-gold/60 bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold",
									children: ["Vencedor: ", s.winner === "p1" ? "Você" : "Frota Inimiga"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: s.winner === "p1" ? "O oceano é seu, Comandante." : "Sua esquadra foi ao fundo. Reagrupe e retorne."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid grid-cols-3 gap-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold",
												children: s.shots
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Disparos"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-base font-bold",
												children: [accuracy, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Precisão"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold",
												children: s.turnCount
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Turnos"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold text-primary",
												children: s.hits
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Dano causado"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold text-destructive",
												children: s.taken
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Dano recebido"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-base font-bold",
												children: [
													s.sunk,
													"/",
													s.lostShips
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Afundou/Perdeu"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex flex-col gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: () => navigate({ to: "/jogar" }),
											children: "Nova batalha"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/perfil",
												children: "Ver progressão"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/",
												children: "Voltar à base"
											})
										})
									]
								})
							]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { MatchPage as component };
