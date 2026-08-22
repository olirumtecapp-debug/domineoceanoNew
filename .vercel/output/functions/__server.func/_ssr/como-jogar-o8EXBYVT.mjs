import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SupportButton, t as Button } from "./SupportButton-D6On0mZE.mjs";
import { t as Logo } from "./Logo-Ba7NMInR.mjs";
import { A as Flame, b as Radar, f as Smartphone, h as Ship, k as House, o as Trophy, t as Waves, u as Target, w as Monitor } from "../_libs/lucide-react.mjs";
import { n as InstallButton, t as FullscreenButton } from "./DeviceButtons-DNvftn9f.mjs";
import { t as GameLink } from "./GameLink-dFsYj47z.mjs";
import { n as SHIP_SPRITES, t as MAP_IMAGES } from "./assets-CoqDvaie.mjs";
import { i as SHIP_DEFS, r as MAPS, t as ABILITIES } from "./fleet-BFcBnVZD.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/como-jogar-o8EXBYVT.js
var import_jsx_runtime = require_jsx_runtime();
function HowToPlay() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-4 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-6 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { compact: true })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullscreenButton, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportButton, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: "gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }), " Base"]
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-black uppercase tracking-tight",
					children: "Como jogar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 rounded-xl panel-metal p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-lg font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-5 w-5 text-primary" }), " Objetivo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Vence quem afundar toda a frota inimiga. O combate é por turnos: você dispara em uma célula do oceano inimigo, descobre se acertou e passa o comando. Ilhas, rochas e faróis bloqueiam disparos, mas nunca impedem a vitória."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Escolha tamanho do oceano, mapa e nível do adversário." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Posicione sua frota (ou use o posicionamento automático)." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ataque célula a célula e use habilidades para revelar posições." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Afunde toda a esquadra inimiga antes que ela afunde a sua." })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-lg font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ship, { className: "h-5 w-5 text-accent" }), " A frota"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: SHIP_DEFS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "overflow-hidden rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex h-24 items-center justify-center bg-[oklch(0.22_0.05_240)] p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: SHIP_SPRITES[s.key],
									alt: s.name,
									loading: "lazy",
									className: "max-h-full max-w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-2 top-2 flex gap-[2px]",
									children: Array.from({ length: s.size }, (_, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-[2px] bg-primary/80" }, k))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-semibold",
									children: [
										s.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"• ",
												s.size,
												" seções"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [s.desc, s.armor > 1 && ` Blindagem ${s.armor}x.`]
								})]
							})]
						}, s.key))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-lg font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, { className: "h-5 w-5 text-primary" }), " Cenários de batalha"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-3 sm:grid-cols-3",
						children: MAPS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "overflow-hidden rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: MAP_IMAGES[m.key],
								alt: m.name,
								loading: "lazy",
								className: "h-24 w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: m.desc
								})]
							})]
						}, m.key))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-lg font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-5 w-5 text-destructive" }), " Leitura do combate"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 grid gap-2 sm:grid-cols-2 text-[12px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "💥 Explosão + fogo"
								}), " — impacto confirmado no casco inimigo. A célula fica vermelha."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "💧 Respingo azul"
								}), " — tiro na água. A célula escurece e não pode ser atacada de novo."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "☠ Detonação em cadeia"
								}), " — navio afundado: toda a silhueta explode seção por seção e a tela treme."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "◎ Pulso ciano"
								}), " — varredura de radar, sonar ou drone revelando o setor."]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-lg font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, { className: "h-5 w-5 text-primary" }), " Habilidades especiais"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-2 sm:grid-cols-2",
						children: ABILITIES.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold",
								children: [
									a.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"• recarga ",
											a.cooldown,
											" turnos"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: a.desc
							})]
						}, a.key))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-lg font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5 text-accent" }), " Instalar no celular ou tablet"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: [
								"Abra ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "https://domineoceano.lovable.app" }),
								" no navegador do celular, tablet ou computador e depois use o botão \"Instalar app\"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameLink, {
							className: "mt-3",
							label: "Endereço do jogo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Android (Chrome, Edge ou Brave):" }), " toque em \"Instalar app\" nesta página; se não aparecer, use o menu ⋮ → \"Instalar aplicativo\"."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "iPhone / iPad (Safari):" }), " toque em Compartilhar ⬆ → \"Adicionar à Tela de Início\". O jogo abrirá como um app."] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-lg font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-5 w-5 text-primary" }), " Instalar no computador ou notebook"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "No Chrome, Edge ou Brave, clique em \"Instalar app\" abaixo ou no ícone de instalar da barra de endereço. O jogo passa a abrir em janela própria, como um programa. Use \"Tela cheia\" para uma experiência imersiva — clique novamente para desativar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, { size: "default" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullscreenButton, { size: "default" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-lg font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5 text-accent" }), " Progressão"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							"Cada batalha rende XP conforme vitória, precisão e navios afundados. Suba de nível, desbloqueie conquistas e acompanhe tudo na página de ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/perfil",
								className: "text-primary underline",
								children: "Perfil"
							}),
							"."
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { HowToPlay as component };
