import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SupportButton, t as Button } from "./SupportButton-D6On0mZE.mjs";
import { t as Logo } from "./Logo-Ba7NMInR.mjs";
import { F as Bot, I as BookOpen, R as Anchor, a as User, i as Users, t as Waves } from "../_libs/lucide-react.mjs";
import { n as InstallButton, t as FullscreenButton } from "./DeviceButtons-DNvftn9f.mjs";
import { t as GameLink } from "./GameLink-dFsYj47z.mjs";
import { t as MAP_IMAGES } from "./assets-CoqDvaie.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as OceanScene } from "./OceanScene-C5SirJvV.mjs";
import { t as audio } from "./audio-DtgDOpK1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DltOhPV4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	(0, import_react.useEffect)(() => {
		audio.load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: MAP_IMAGES.mar_aberto,
				alt: "",
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-x-0 top-0 h-[85vh] w-full object-cover",
				style: {
					maskImage: "linear-gradient(to bottom, #000 55%, transparent)",
					WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent)"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OceanScene, {
				weather: "sunset",
				className: "pointer-events-none absolute inset-0 h-full w-full opacity-60"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-b from-background/45 via-background/20 to-background" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullscreenButton, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportButton, {})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "flex flex-1 flex-col justify-center py-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-2xl animate-od-rise",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, { className: "h-3.5 w-3.5 text-primary" }), " Guerra naval moderna"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl",
										children: ["Domine o ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gradient-gold",
											children: "Oceano"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 max-w-xl text-sm text-muted-foreground sm:text-base",
										children: "As maiores potências marítimas disputam o controle dos mares. Assuma o comando de uma frota de elite, leia o inimigo, use radar, sonar e mísseis guiados — e afunde tudo que cruzar seu caminho."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 flex flex-wrap gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											className: "gap-2 glow-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/online",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" }), " Batalha online com código"]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											variant: "secondary",
											className: "gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/jogar",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5" }), " Jogar contra a IA"]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "ghost",
											className: "gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/como-jogar",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" }), " Como jogar"]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "ghost",
											className: "gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/perfil",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), " Perfil e progressão"]
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-12 grid gap-3 sm:grid-cols-3",
								children: [
									{
										t: "6 níveis de IA",
										d: "Do recruta ao Almirante Supremo — nunca atira ao acaso quando tem informação."
									},
									{
										t: "Habilidades táticas",
										d: "Radar, sonar, míssil guiado, ataque aéreo, drone e cortina de fumaça."
									},
									{
										t: "Mapas e frotas",
										d: "Tabuleiros 8x8 a 12x12, ilhas, faróis, plataformas e 7 classes de navio."
									}
								].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl panel-metal p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 text-sm font-bold",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, { className: "h-4 w-4 text-accent" }),
											" ",
											c.t
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: c.d
									})]
								}, c.t))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameLink, { className: "mt-6 max-w-xl" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "rounded-xl panel-metal p-4 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: "Funciona em celular, tablet e computador. Instale como app no Android ou no PC (Chrome, Edge ou Brave)."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1",
							children: [
								"No iPhone/iPad, use Compartilhar ⬆ → \"Adicionar à Tela de Início\". Passo a passo completo em",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/como-jogar",
									className: "text-primary underline",
									children: "Como jogar"
								}),
								"."
							]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { Index as component };
