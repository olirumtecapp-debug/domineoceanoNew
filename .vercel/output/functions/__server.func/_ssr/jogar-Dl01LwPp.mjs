import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SupportButton, r as cn, t as Button } from "./SupportButton-D6On0mZE.mjs";
import { t as Logo } from "./Logo-Ba7NMInR.mjs";
import { d as Swords, k as House } from "../_libs/lucide-react.mjs";
import { t as MAP_IMAGES } from "./assets-CoqDvaie.mjs";
import { a as fleetForSize, n as DIFFICULTIES, r as MAPS } from "./fleet-BFcBnVZD.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as OceanScene } from "./OceanScene-C5SirJvV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jogar-Dl01LwPp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SetupPage() {
	const navigate = useNavigate();
	const [size, setSize] = (0, import_react.useState)(10);
	const [map, setMap] = (0, import_react.useState)("arquipelago");
	const [difficulty, setDifficulty] = (0, import_react.useState)("normal");
	const start = () => navigate({
		to: "/partida",
		search: {
			size,
			map,
			difficulty
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OceanScene, {
				weather: "sunset",
				intensity: "calm",
				className: "pointer-events-none absolute inset-0 h-full w-full opacity-80"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-background/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto max-w-4xl px-4 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-6 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { compact: true })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: "gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }), " Base"]
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black uppercase tracking-tight",
						children: "Preparar batalha"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Combate contra a Inteligência Artificial em seis níveis de dificuldade."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 rounded-xl panel-metal p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold uppercase tracking-widest text-muted-foreground",
							children: "Tamanho do oceano"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-3 gap-2",
							children: [
								8,
								10,
								12
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSize(s),
								className: cn("rounded-lg border border-border p-3 text-center transition-colors", size === s ? "border-primary bg-primary/15" : "hover:bg-muted/40"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-lg font-bold",
									children: [
										s,
										"x",
										s
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [fleetForSize(s).length, " embarcações"]
								})]
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4 rounded-xl panel-metal p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold uppercase tracking-widest text-muted-foreground",
							children: "Campo de batalha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-2 sm:grid-cols-3",
							children: MAPS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setMap(m.key),
								className: cn("overflow-hidden rounded-lg border border-border text-left transition-colors", map === m.key ? "border-primary bg-primary/15" : "hover:bg-muted/40"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: MAP_IMAGES[m.key],
									alt: m.name,
									loading: "lazy",
									className: cn("h-20 w-full object-cover transition-opacity", map === m.key ? "opacity-100" : "opacity-70")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold",
										children: m.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[11px] text-muted-foreground",
										children: m.desc
									})]
								})]
							}, m.key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4 rounded-xl panel-metal p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold uppercase tracking-widest text-muted-foreground",
							children: "Nível do adversário"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-2 sm:grid-cols-3",
							children: DIFFICULTIES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setDifficulty(d.key),
								className: cn("rounded-lg border border-border p-3 text-left transition-colors", difficulty === d.key ? "border-accent bg-accent/20" : "hover:bg-muted/40"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: d.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: d.desc
								})]
							}, d.key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						className: "mt-6 w-full gap-2 glow-primary",
						onClick: start,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "h-5 w-5" }), " Zarpar para o combate"]
					})
				]
			})
		]
	});
}
//#endregion
export { SetupPage as component };
