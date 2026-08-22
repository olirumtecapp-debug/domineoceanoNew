import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SupportButton, r as cn, t as Button } from "./SupportButton-D6On0mZE.mjs";
import { D as LoaderCircle, N as Copy, _ as RotateCw, i as Users, k as House, m as Shuffle, n as VolumeX, o as Trophy, p as Skull, r as Volume2, x as Play } from "../_libs/lucide-react.mjs";
import { t as FullscreenButton } from "./DeviceButtons-DNvftn9f.mjs";
import { t as GameLink } from "./GameLink-dFsYj47z.mjs";
import { n as SHIP_SPRITES, t as MAP_IMAGES } from "./assets-CoqDvaie.mjs";
import { a as fleetForSize, r as MAPS } from "./fleet-BFcBnVZD.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as OceanScene } from "./OceanScene-C5SirJvV.mjs";
import { t as supabase } from "./client-Su2Se3-N.mjs";
import { a as cellOpen, f as resolveShot, i as canPlace, n as allSunk, o as coordLabel, p as shipCells, r as autoPlaceFleet, s as createPlayer, u as makeShip } from "./engine-DF6RRqDJ.mjs";
import { a as finishRoom, c as sendMove, i as fetchRoom, l as submitFleet, o as joinRoom, r as fetchMoves, s as recallSide, t as Input } from "./online-BSRM7Od_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-Calv0BAc.mjs";
import { t as audio } from "./audio-DtgDOpK1.mjs";
import { n as Badge, o as recordMatch, r as Progress } from "./profile-BaKPOKKn.mjs";
import { n as Board, r as fx, t as AdvantagePanel } from "./Board-BCXwU8hk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sala._code-0qBQkbLo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoomPage() {
	const { code } = Route.useParams();
	const navigate = useNavigate();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [moves, setMoves] = (0, import_react.useState)([]);
	const [side, setSide] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [joinName, setJoinName] = (0, import_react.useState)("");
	const [ships, setShips] = (0, import_react.useState)([]);
	const [selectedShipIdx, setSelectedShipIdx] = (0, import_react.useState)(0);
	const [orientation, setOrientation] = (0, import_react.useState)("h");
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [shake, setShake] = (0, import_react.useState)(false);
	const seen = (0, import_react.useRef)(0);
	const recorded = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		audio.load();
		setMuted(audio.settings.muted);
		return () => audio.stopMusic();
	}, []);
	const refresh = (0, import_react.useCallback)(async () => {
		const r = await fetchRoom(code);
		if (!r) {
			setLoading(false);
			return;
		}
		setRoom(r);
		setMoves(await fetchMoves(r.id));
		setSide(recallSide(code));
		setLoading(false);
	}, [code]);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	(0, import_react.useEffect)(() => {
		if (!room) return;
		const channel = supabase.channel(`room-${room.id}`).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "rooms",
			filter: `id=eq.${room.id}`
		}, (p) => {
			setRoom(p.new);
		}).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "room_moves",
			filter: `room_id=eq.${room.id}`
		}, (p) => {
			setMoves((prev) => {
				const row = p.new;
				return prev.some((m) => m.id === row.id) ? prev : [...prev, row];
			});
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [room?.id]);
	const size = room?.size ?? 10;
	const fleet = (0, import_react.useMemo)(() => fleetForSize(size), [size]);
	const myShips = side === "host" ? room?.host_ships : room?.guest_ships;
	const foeShips = side === "host" ? room?.guest_ships : room?.host_ships;
	const myName = side === "host" ? room?.host_name : room?.guest_name;
	const foeName = side === "host" ? room?.guest_name : room?.host_name;
	const foeSide = side === "host" ? "guest" : "host";
	const replay = (0, import_react.useMemo)(() => {
		if (!room || !side || !myShips || !foeShips) return null;
		const me = createPlayer(myName ?? "Você", size, JSON.parse(JSON.stringify(myShips)));
		const foe = createPlayer(foeName ?? "Adversário", size, JSON.parse(JSON.stringify(foeShips)));
		let dealt = 0;
		let taken = 0;
		let shots = 0;
		let hits = 0;
		let sunkByMe = 0;
		let lostByMe = 0;
		for (const mv of moves) {
			const mine = mv.by === side;
			const atk = mine ? me : foe;
			const def = mine ? foe : me;
			if (atk.knowledge[mv.cell] && !cellOpen(atk.knowledge[mv.cell])) continue;
			const out = resolveShot(def, room.terrain, mv.cell);
			atk.knowledge[mv.cell] = {
				...atk.knowledge[mv.cell],
				shot: true,
				result: out.result
			};
			def.incoming[mv.cell] = {
				shot: true,
				result: out.result
			};
			if (out.ship?.sunk) out.ship.cells.forEach((c) => {
				atk.knowledge[c] = {
					...atk.knowledge[c],
					shot: true,
					result: "sunk"
				};
				def.incoming[c] = {
					shot: true,
					result: "sunk"
				};
			});
			if (out.result === "blocked") continue;
			if (mine) {
				shots++;
				if (out.result !== "miss") {
					hits++;
					dealt++;
					if (out.ship?.sunk) sunkByMe++;
				}
			} else if (out.result !== "miss") {
				taken++;
				if (out.ship?.sunk) lostByMe++;
			}
		}
		return {
			me,
			foe,
			dealt,
			taken,
			shots,
			hits,
			sunkByMe,
			lostByMe
		};
	}, [
		room,
		side,
		myShips,
		foeShips,
		moves,
		size,
		myName,
		foeName
	]);
	(0, import_react.useEffect)(() => {
		if (!replay || !side) return;
		if (seen.current === 0) {
			seen.current = moves.length;
			return;
		}
		const fresh = moves.slice(seen.current);
		seen.current = moves.length;
		fresh.forEach((mv) => {
			const mine = mv.by === side;
			const board = mine ? "enemy" : "own";
			const view = mine ? replay.foe : replay.me;
			const hit = view.incoming[mv.cell]?.result;
			if (hit === "miss") {
				audio.play("miss");
				fx(board, mv.cell, "splash");
			} else if (hit === "sunk") {
				audio.play("sunk");
				fx(board, mv.cell, "sunk");
				setShake(true);
				setTimeout(() => setShake(false), 500);
				const ship = view.ships.find((sh) => sh.cells.includes(mv.cell));
				const left = view.ships.filter((sh) => !sh.sunk).length;
				if (mine) toast.success(`${ship?.name ?? "Navio"} inimigo AFUNDADO! Faltam ${left}.`);
				else toast.error(`Seu ${ship?.name ?? "navio"} foi afundado! Restam ${left}.`);
			} else {
				audio.play("hit");
				fx(board, mv.cell, "explosion");
			}
		});
	}, [
		moves,
		replay,
		side
	]);
	const battleReady = Boolean(room?.host_ships && room?.guest_ships);
	const turnSide = moves.length % 2 === 0 ? "host" : "guest";
	const myTurn = battleReady && side === turnSide && !room?.winner;
	const winner = (0, import_react.useMemo)(() => {
		if (!replay) return room?.winner ?? null;
		if (allSunk(replay.foe)) return side;
		if (allSunk(replay.me)) return foeSide;
		return room?.winner ?? null;
	}, [
		replay,
		room?.winner,
		side,
		foeSide
	]);
	(0, import_react.useEffect)(() => {
		if (!room || !winner || recorded.current || !replay) return;
		recorded.current = true;
		audio.stopMusic();
		audio.play(winner === side ? "victory" : "defeat");
		finishRoom(room, winner);
		recordMatch({
			win: winner === side,
			shots: replay.shots,
			hits: replay.hits,
			sunk: replay.sunkByMe,
			difficulty: "normal",
			size
		});
	}, [
		winner,
		room,
		replay,
		side,
		size
	]);
	const remainingDefs = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		ships.forEach((sh) => counts.set(sh.key, (counts.get(sh.key) ?? 0) + 1));
		const left = [];
		const used = /* @__PURE__ */ new Map();
		for (const def of fleet) {
			const u = used.get(def.key) ?? 0;
			if (u < (counts.get(def.key) ?? 0)) used.set(def.key, u + 1);
			else left.push(def);
		}
		return left;
	}, [fleet, ships]);
	const placeAt = (i) => {
		if (!room) return;
		const def = remainingDefs[Math.min(selectedShipIdx, remainingDefs.length - 1)];
		if (!def) return;
		const cells = shipCells(size, i, def.size, orientation);
		if (!cells || !canPlace(size, room.terrain, ships, cells)) {
			toast.error("Posição inválida para essa embarcação.");
			return;
		}
		setShips((prev) => [...prev, makeShip(def, cells)]);
		audio.play("click");
		setSelectedShipIdx(0);
	};
	const confirmFleet = async () => {
		if (!room || !side) return;
		if (remainingDefs.length) {
			toast.error("Posicione toda a frota antes de confirmar.");
			return;
		}
		await submitFleet(room, side, ships);
		audio.resume();
		audio.startMusic();
		toast.success("Frota confirmada! Aguardando o adversário.");
		refresh();
	};
	const fire = async (index) => {
		if (!room || !side || !myTurn) return;
		audio.play("shot");
		try {
			await sendMove(room, side, index);
		} catch {
			toast.error("Falha ao enviar o disparo. Verifique sua conexão.");
		}
	};
	const enterRoom = async () => {
		try {
			await joinRoom(code, joinName);
			await refresh();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Não foi possível entrar.");
		}
	};
	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(code.toUpperCase());
			toast.success("Código copiado!");
		} catch {
			toast.error("Copie manualmente: " + code.toUpperCase());
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (!room) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black uppercase",
				children: "Sala não encontrada"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"O código ",
					code.toUpperCase(),
					" não existe ou a batalha expirou."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => navigate({ to: "/online" }),
				children: "Voltar ao lobby"
			})
		]
	});
	const mapName = MAPS.find((m) => m.key === room.map)?.name ?? "Mar Aberto";
	if (!side) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OceanScene, {
			weather: "night",
			intensity: "calm",
			className: "pointer-events-none absolute inset-0 h-full w-full opacity-70"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-[min(92vw,420px)] rounded-2xl panel-metal p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto h-10 w-10 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-3 text-xl font-black uppercase tracking-widest",
					children: ["Sala ", code.toUpperCase()]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [room.host_name, " está no comando. Informe seu nome para assumir a esquadra rival."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: joinName,
					maxLength: 20,
					onChange: (e) => setJoinName(e.target.value),
					placeholder: "Comandante",
					className: "mt-4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: enterRoom,
					children: "Entrar na batalha"
				})
			]
		})]
	});
	const iAmReady = Boolean(myShips);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative min-h-screen", shake && "animate-od-shake"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: MAP_IMAGES[room.map],
				alt: "",
				"aria-hidden": true,
				className: "pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none fixed inset-0 bg-background/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto max-w-7xl px-3 py-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl panel-metal px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: copyCode,
									className: "flex items-center gap-2 rounded-md bg-primary/20 px-3 py-1 font-mono text-sm font-bold tracking-[0.3em] text-primary",
									children: [room.code, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: ["Cenário: ", mapName]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: [
										room.size,
										"x",
										room.size
									]
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
					!iAmReady && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-[1fr_320px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl panel-metal p-3 sm:p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
								size,
								terrain: room.terrain,
								knowledge: createPlayer("", size, []).incoming,
								ships,
								onCell: placeAt,
								mapKey: room.map,
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
									children: foeName ? `${foeName} entrou na sala.` : "Aguardando o adversário entrar com o código."
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
											onClick: () => setShips(autoPlaceFleet(size, room.terrain)),
											className: "gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "h-4 w-4" }), " Auto"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => setShips([]),
											children: "Limpar"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-4 space-y-2",
									children: remainingDefs.map((def, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
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
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold",
												children: def.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: def.desc
											})
										]
									}) }, `${def.key}-${i}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "mt-4 w-full gap-2",
									disabled: remainingDefs.length > 0,
									onClick: confirmFleet,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), " Confirmar frota"]
								})
							]
						})]
					}),
					iAmReady && !battleReady && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-12 w-[min(92vw,460px)] rounded-2xl panel-metal p-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-10 w-10 animate-spin text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 text-xl font-black uppercase tracking-widest",
								children: "Aguardando o adversário"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: foeName ? `${foeName} ainda está posicionando a frota.` : "Compartilhe o código da sala para que alguém entre na batalha."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: copyCode,
								className: "mx-auto mt-4 flex items-center gap-2 rounded-lg bg-primary/20 px-5 py-3 font-mono text-2xl font-black tracking-[0.4em] text-primary",
								children: [room.code, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs text-muted-foreground",
								children: "Peça para o seu adversário abrir o endereço abaixo no computador ou no celular e digitar o código."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-left",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameLink, { compact: true })
							})
						]
					}),
					battleReady && replay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-[1fr_1fr_300px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl panel-metal p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
									size,
									terrain: room.terrain,
									knowledge: replay.me.knowledge,
									onCell: (i) => void fire(i),
									disabled: !myTurn || Boolean(winner),
									boardId: "enemy",
									mapKey: room.map,
									label: `Oceano de ${foeName ?? "adversário"}`
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl panel-metal p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
									size,
									terrain: room.terrain,
									knowledge: replay.me.incoming,
									ships: replay.me.ships,
									boardId: "own",
									mapKey: room.map,
									label: "Sua frota"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 space-y-1",
									children: replay.me.ships.map((sh) => {
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvantagePanel, {
									me: replay.me,
									foe: replay.foe,
									myName: myName ?? "Sua frota",
									foeName: foeName ?? "Frota inimiga",
									turnNumber: moves.length + 1,
									myTurn,
									over: Boolean(winner),
									statusText: winner ? winner === side ? "Você venceu!" : "Você foi derrotado" : myTurn ? "Suas ordens" : `${foeName ?? "Adversário"} atacando...`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
														children: replay.dealt
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted-foreground",
														children: "Dano causado"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-md bg-muted/40 p-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-base font-bold text-destructive",
														children: replay.taken
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-muted-foreground",
														children: "Dano recebido"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-md bg-muted/40 p-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-base font-bold text-accent",
														children: [replay.shots ? Math.round(replay.hits / replay.shots * 100) : 0, "%"]
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
															replay.sunkByMe,
															"/",
															replay.lostByMe
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
											children: [...moves].slice(-4).reverse().map((mv) => {
												const mine = mv.by === side;
												const res = (mine ? replay.foe : replay.me).incoming[mv.cell]?.result;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: cn("truncate rounded px-2 py-1", res === "sunk" && "bg-destructive/30 font-semibold", res === "hit" && "bg-destructive/15", !mine && "text-muted-foreground"),
													children: [
														mine ? "Você" : foeName ?? "Inimigo",
														" → ",
														coordLabel(size, mv.cell),
														":",
														" ",
														res === "miss" ? "água" : res === "sunk" ? "AFUNDOU" : "impacto"
													]
												}, mv.id);
											})
										})
									]
								})]
							})
						]
					}),
					winner && replay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fixed inset-0 z-40 flex items-center justify-center bg-background/85 backdrop-blur",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-[min(92vw,440px)] rounded-2xl panel-metal p-6 text-center animate-od-rise",
							children: [
								winner === side ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "mx-auto h-12 w-12 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skull, { className: "mx-auto h-12 w-12 text-destructive" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 text-2xl font-black uppercase tracking-widest",
									children: winner === side ? "Vitória Naval" : "Frota Perdida"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mx-auto mt-2 w-fit rounded-full border border-gold/60 bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold",
									children: ["Vencedor: ", winner === side ? myName ?? "Você" : foeName ?? "Adversário"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: winner === side ? `Você dominou ${foeName ?? "o adversário"} nesta batalha.` : `${foeName ?? "O adversário"} levou a melhor desta vez.`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid grid-cols-3 gap-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold",
												children: replay.shots
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Disparos"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-base font-bold",
												children: [replay.shots ? Math.round(replay.hits / replay.shots * 100) : 0, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Precisão"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold",
												children: moves.length
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Jogadas"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold text-primary",
												children: replay.dealt
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: "Dano causado"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-muted/40 p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold text-destructive",
												children: replay.taken
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
													replay.sunkByMe,
													"/",
													replay.lostByMe
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
											onClick: () => navigate({ to: "/online" }),
											children: "Nova sala"
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
export { RoomPage as component };
