import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./SupportButton-D6On0mZE.mjs";
import { C as Mountain, O as LifeBuoy, c as Trees, d as Swords, g as ShieldCheck, j as Factory, l as TowerControl, s as TrendingDown } from "../_libs/lucide-react.mjs";
import { n as SHIP_SPRITES, t as MAP_IMAGES } from "./assets-CoqDvaie.mjs";
import { a as cellOpen, d as remainingSections, g as xy, h as totalSections, m as shipsAlive, o as coordLabel, t as advantage } from "./engine-DF6RRqDJ.mjs";
import { r as Progress } from "./profile-BaKPOKKn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Board-BCXwU8hk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATE = {
	winning: {
		label: "Vencendo",
		tone: "text-emerald-400 border-emerald-400/60 bg-emerald-400/10",
		Icon: ShieldCheck
	},
	even: {
		label: "Equilibrado",
		tone: "text-gold border-gold/60 bg-gold/10",
		Icon: Swords
	},
	losing: {
		label: "Perdendo",
		tone: "text-destructive border-destructive/60 bg-destructive/10",
		Icon: TrendingDown
	}
};
function AdvantagePanel({ me, foe, myName = "Sua frota", foeName = "Frota inimiga", turnNumber, statusText, myTurn, over }) {
	const conf = STATE[advantage(me, foe)];
	const Icon = conf.Icon;
	const myAlive = remainingSections(me);
	const foeAlive = remainingSections(foe);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl panel-metal p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs uppercase tracking-widest text-muted-foreground",
					children: ["Turno ", turnNumber]
				}), !over && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2.5 w-2.5 animate-pulse rounded-full", myTurn ? "bg-primary" : "bg-destructive") })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-lg font-bold", over ? "text-foreground" : myTurn ? "text-primary" : "text-destructive"),
				children: statusText
			}),
			!over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-2 flex items-center gap-2 rounded-lg border px-3 py-2", conf.tone),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-black uppercase tracking-widest",
						children: conf.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] opacity-80",
						children: [
							shipsAlive(me),
							" × ",
							shipsAlive(foe),
							" navios • ",
							myAlive,
							" × ",
							foeAlive,
							" seções"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: myName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						myAlive,
						"/",
						totalSections(me)
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: myAlive / Math.max(1, totalSections(me)) * 100,
					className: "h-2"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: foeName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						foeAlive,
						"/",
						totalSections(foe)
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: foeAlive / Math.max(1, totalSections(foe)) * 100,
					className: "h-2"
				})] })]
			})
		]
	});
}
var handlers = /* @__PURE__ */ new Map();
function registerFx(id, fn) {
	handlers.set(id, fn);
	return () => {
		if (handlers.get(id) === fn) handlers.delete(id);
	};
}
/** Trigger a visual effect on a given board at a given cell index. */
function fx(boardId, cell, kind) {
	handlers.get(boardId)?.(cell, kind);
}
var rnd = (a, b) => a + Math.random() * (b - a);
function spawn(kind, x, y, cell) {
	const out = [];
	const push = (p) => out.push({
		x,
		y,
		vx: 0,
		vy: 0,
		life: 0,
		max: 60,
		size: 4,
		...p
	});
	if (kind === "explosion" || kind === "sunk" || kind === "missile") {
		const power = kind === "sunk" ? 1.7 : kind === "missile" ? 1.3 : 1;
		push({
			kind: "ring",
			max: 26 * power,
			size: 4
		});
		for (let i = 0; i < 22 * power; i++) {
			const a = rnd(0, Math.PI * 2);
			const sp = rnd(.6, 3.4) * power;
			push({
				kind: "fire",
				vx: Math.cos(a) * sp,
				vy: Math.sin(a) * sp - .4,
				life: 0,
				max: rnd(18, 38),
				size: rnd(2, 6) * power
			});
		}
		for (let i = 0; i < 14 * power; i++) {
			const a = rnd(0, Math.PI * 2);
			push({
				kind: "smoke",
				vx: Math.cos(a) * rnd(.2, 1.1),
				vy: Math.sin(a) * rnd(.2, 1.1) - .6,
				max: rnd(45, 90),
				size: rnd(4, 11) * power
			});
		}
		for (let i = 0; i < 10 * power; i++) {
			const a = rnd(0, Math.PI * 2);
			const sp = rnd(2, 6) * power;
			push({
				kind: "spark",
				vx: Math.cos(a) * sp,
				vy: Math.sin(a) * sp,
				max: rnd(14, 30),
				size: rnd(1, 2.2)
			});
		}
		if (kind === "sunk") for (let i = 0; i < 10; i++) {
			const a = rnd(0, Math.PI * 2);
			push({
				kind: "debris",
				vx: Math.cos(a) * rnd(1, 4),
				vy: Math.sin(a) * rnd(1, 4),
				max: rnd(30, 55),
				size: rnd(2, 4)
			});
		}
	}
	if (kind === "splash") {
		push({
			kind: "ring",
			max: 22,
			size: 3
		});
		for (let i = 0; i < 20; i++) {
			const a = rnd(-Math.PI, 0);
			const sp = rnd(1, 3);
			push({
				kind: "water",
				vx: Math.cos(a) * sp,
				vy: Math.sin(a) * sp,
				max: rnd(20, 40),
				size: rnd(1.5, 3.5)
			});
		}
	}
	if (kind === "scan") {
		push({
			kind: "ring",
			max: 44,
			size: 2,
			hue: 190
		});
		for (let i = 0; i < 10; i++) {
			const a = rnd(0, Math.PI * 2);
			push({
				kind: "spark",
				vx: Math.cos(a) * rnd(.4, 1.4),
				vy: Math.sin(a) * rnd(.4, 1.4),
				max: 34,
				size: 1.6,
				hue: 190
			});
		}
	}
	return out;
}
function step(p) {
	p.life++;
	p.x += p.vx;
	p.y += p.vy;
	if (p.kind === "smoke") {
		p.vy -= .02;
		p.vx *= .96;
		p.size += .22;
	} else if (p.kind === "water" || p.kind === "debris") {
		p.vy += .14;
		p.vx *= .99;
	} else if (p.kind === "fire") {
		p.vx *= .9;
		p.vy = p.vy * .9 - .06;
	} else if (p.kind === "spark") {
		p.vx *= .93;
		p.vy = p.vy * .93 + .05;
	}
	return p.life < p.max;
}
function paint(ctx, p) {
	const t = p.life / p.max;
	const fade = 1 - t;
	ctx.globalCompositeOperation = p.kind === "smoke" ? "source-over" : "lighter";
	if (p.kind === "ring") {
		const r = 4 + t * 34;
		ctx.globalCompositeOperation = "lighter";
		ctx.strokeStyle = p.hue != null ? `hsla(${p.hue},90%,65%,${fade * .7})` : `rgba(255,${180 - t * 80},${90 - t * 60},${fade * .8})`;
		ctx.lineWidth = 2.4 * fade + .4;
		ctx.beginPath();
		ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
		ctx.stroke();
		return;
	}
	let color;
	switch (p.kind) {
		case "fire":
			color = `rgba(255,${Math.round(220 - t * 170)},${Math.round(120 - t * 110)},${fade})`;
			break;
		case "smoke":
			color = `rgba(${40 + t * 30},${44 + t * 30},${52 + t * 30},${fade * .42})`;
			break;
		case "spark":
			color = p.hue != null ? `hsla(${p.hue},95%,70%,${fade})` : `rgba(255,240,190,${fade})`;
			break;
		case "water":
			color = `rgba(170,225,255,${fade * .9})`;
			break;
		default: color = `rgba(30,34,40,${fade})`;
	}
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(p.x, p.y, Math.max(.4, p.size * (p.kind === "fire" ? fade : 1)), 0, Math.PI * 2);
	ctx.fill();
}
/** Canvas overlay that renders explosions, splashes and scan pulses on a board. */
function FxCanvas({ boardId, size, className }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let particles = [];
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
			const batch = spawn(kind, (cell % size + .5) * (w / size), (Math.floor(cell / size) + .5) * (h / size), cell);
			particles.push(...reduced ? batch.slice(0, 6) : batch);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className,
		"aria-hidden": true
	});
}
var TERRAIN_ICON = {
	island: Trees,
	rock: Mountain,
	lighthouse: TowerControl,
	buoy: LifeBuoy,
	rig: Factory
};
var Board = (0, import_react.memo)(function Board({ size, terrain, knowledge, ships, onCell, disabled, highlight = [], label, compact, boardId, mapKey }) {
	const [hover, setHover] = (0, import_react.useState)(null);
	const shipCellMap = /* @__PURE__ */ new Map();
	ships?.forEach((s) => s.cells.forEach((c, pos) => shipCellMap.set(c, {
		ship: s,
		pos
	})));
	const pct = 100 / size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
				children: label
			}), onCell && !disabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-primary",
				children: hover !== null ? `ALVO ${coordLabel(size, hover)}` : "ALVO --"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-xl border border-border p-1.5 sm:p-2",
			children: [
				mapKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: MAP_IMAGES[mapKey],
					alt: "",
					"aria-hidden": true,
					loading: "lazy",
					className: "pointer-events-none absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0",
					style: { background: "radial-gradient(ellipse at center, oklch(0.18 0.05 245 / 0.12) 30%, oklch(0.12 0.04 248 / 0.72) 100%)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid w-3 shrink-0 gap-[2px] text-[8px] sm:w-4 sm:gap-[3px] sm:text-[10px]",
						style: {
							gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
							marginTop: "calc(0.85rem + 2px)"
						},
						"aria-hidden": true,
						children: Array.from({ length: size }, (_, r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("flex items-center justify-center font-mono font-bold leading-none", hover !== null && xy(size, hover).y === r ? "text-accent" : "text-[oklch(0.9_0.05_225)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"),
							children: r + 1
						}, r))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-[2px] grid h-[0.85rem] gap-[2px] text-[8px] sm:gap-[3px] sm:text-[10px]",
							style: { gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` },
							"aria-hidden": true,
							children: Array.from({ length: size }, (_, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("flex items-center justify-center font-mono font-bold leading-none", hover !== null && xy(size, hover).x === c ? "text-accent" : "text-[oklch(0.9_0.05_225)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"),
								children: String.fromCharCode(65 + c)
							}, c))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-[2px] sm:gap-[3px]",
									style: { gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` },
									children: Array.from({ length: size * size }, (_, i) => {
										const k = knowledge[i];
										const t = terrain[i];
										const own = shipCellMap.get(i);
										const damagedHere = k.shot && k.result === "damaged";
										const hitHere = k.shot && (k.result === "hit" || k.result === "sunk" || k.result === "damaged");
										const missHere = k.shot && k.result === "miss";
										const sunkShip = own?.ship.sunk;
										const { x, y } = xy(size, i);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: disabled || !cellOpen(k) || t !== "water",
											onClick: () => onCell?.(i),
											onMouseEnter: () => setHover(i),
											onMouseLeave: () => setHover((h) => h === i ? null : h),
											onFocus: () => setHover(i),
											"aria-label": `Célula ${coordLabel(size, i)}`,
											className: cn("group relative aspect-square rounded-[3px] ring-inset ring-[oklch(0.75_0.06_225_/_0.18)] transition-all duration-150", "bg-[oklch(0.30_0.06_230_/_0.14)] ring-1", (x + y) % 2 === 0 && "bg-[oklch(0.85_0.05_225_/_0.10)]", t !== "water" && "bg-[oklch(0.35_0.03_120_/_0.45)]", !disabled && cellOpen(k) && t === "water" && onCell && "cursor-crosshair hover:bg-primary/40 hover:ring-1 hover:ring-primary", missHere && "bg-[oklch(0.24_0.04_240_/_0.80)]", hitHere && "bg-destructive/75", damagedHere && "bg-gold/60 ring-1 ring-gold", sunkShip && "bg-destructive/85", k.revealedShip && !k.shot && "ring-1 ring-gold", highlight.includes(i) && "ring-2 ring-accent", compact ? "text-[7px]" : "text-[9px] sm:text-[11px]"),
											children: [
												t !== "water" && (() => {
													const Icon = TERRAIN_ICON[t];
													return Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "absolute inset-0 m-auto h-1/2 w-1/2 text-[oklch(0.78_0.09_115)]" }) : null;
												})(),
												missHere && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute inset-0 flex items-center justify-center text-primary/70",
													children: "•"
												}),
												hitHere && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute inset-0 z-20 flex items-center justify-center text-[10px] animate-od-rise",
													children: sunkShip ? "☠" : damagedHere ? "✷" : "🔥"
												}),
												k.revealed && !k.shot && !k.revealedShip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute inset-0 flex items-center justify-center text-primary/50",
													children: "·"
												}),
												k.revealedShip && !k.shot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute inset-0 flex items-center justify-center text-gold",
													children: "◎"
												})
											]
										}, i);
									})
								}),
								ships && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pointer-events-none absolute inset-0 z-10",
									children: ships.map((s) => {
										const first = xy(size, s.cells[0]);
										const vertical = s.cells.length > 1 && s.cells[1] - s.cells[0] === size;
										const w = vertical ? 1 : s.cells.length;
										const h = vertical ? s.cells.length : 1;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("absolute flex items-center justify-center transition-opacity", s.sunk ? "opacity-40 grayscale" : "opacity-95"),
											style: {
												left: `${first.x * pct}%`,
												top: `${first.y * pct}%`,
												width: `${w * pct}%`,
												height: `${h * pct}%`
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: SHIP_SPRITES[s.key],
												alt: "",
												"aria-hidden": true,
												loading: "lazy",
												className: "max-h-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)]",
												style: vertical ? {
													width: `${h / w * 100}%`,
													height: `${w / h * 100}%`,
													objectFit: "fill",
													transform: "rotate(90deg)"
												} : {
													width: "100%",
													height: "100%",
													objectFit: "fill"
												}
											})
										}, s.id);
									})
								}),
								boardId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxCanvas, {
									boardId,
									size,
									className: "pointer-events-none absolute inset-0 z-30 h-full w-full"
								})
							]
						})]
					})]
				})
			]
		})]
	});
});
//#endregion
export { Board as n, fx as r, AdvantagePanel as t };
