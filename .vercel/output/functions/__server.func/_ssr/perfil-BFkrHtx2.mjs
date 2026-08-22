import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SupportButton, r as cn, t as Button } from "./SupportButton-D6On0mZE.mjs";
import { t as Logo } from "./Logo-Ba7NMInR.mjs";
import { L as Award, h as Ship, k as House, o as Trophy, u as Target } from "../_libs/lucide-react.mjs";
import { n as DIFFICULTIES } from "./fleet-BFcBnVZD.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as loadProfile, i as levelFromXp, n as Badge, r as Progress, t as ACHIEVEMENTS } from "./profile-BaKPOKKn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-BFkrHtx2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const [profile, setProfile] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setProfile(loadProfile());
	}, []);
	const stats = profile?.stats;
	const lvl = levelFromXp(stats?.xp ?? 0);
	const accuracy = stats?.shots ? Math.round(stats.hits / stats.shots * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-4 py-6",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl panel-metal p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Comandante"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-2xl font-black uppercase tracking-tight",
								children: ["Nível ", lvl.level]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "bg-accent text-accent-foreground",
								children: [stats?.xp ?? 0, " XP"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: lvl.progress,
							className: "mt-4 h-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: [Math.max(0, lvl.next - (stats?.xp ?? 0)), " XP para o próximo nível"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						{
							icon: Trophy,
							label: "Vitórias",
							value: stats?.wins ?? 0
						},
						{
							icon: Ship,
							label: "Afundados",
							value: stats?.sunk ?? 0
						},
						{
							icon: Target,
							label: "Precisão",
							value: `${accuracy}%`
						},
						{
							icon: Award,
							label: "Partidas",
							value: stats?.played ?? 0
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl panel-metal p-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "mx-auto h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xl font-bold",
								children: c.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: c.label
							})
						]
					}, c.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold uppercase tracking-widest text-muted-foreground",
						children: "Conquistas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-2 sm:grid-cols-2",
						children: ACHIEVEMENTS.map((a) => {
							const unlocked = profile?.achievements.includes(a.key);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("rounded-lg border p-3", unlocked ? "border-accent bg-accent/10" : "border-border opacity-60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: a.desc
								})]
							}, a.key);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4 rounded-xl panel-metal p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold uppercase tracking-widest text-muted-foreground",
						children: "Histórico de confrontos"
					}), !profile?.history.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "Nenhuma batalha registrada ainda."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1 text-xs",
						children: profile.history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between rounded-md bg-muted/30 px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("font-semibold", h.result === "win" ? "text-primary" : "text-destructive"),
									children: h.result === "win" ? "Vitória" : "Derrota"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										DIFFICULTIES.find((d) => d.key === h.difficulty)?.name ?? h.difficulty,
										" • ",
										h.size,
										"x",
										h.size,
										" • ",
										h.accuracy,
										"%"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: new Date(h.date).toLocaleDateString("pt-BR")
								})
							]
						}, i))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					className: "mt-6 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/jogar",
						children: "Nova batalha"
					})
				})
			]
		})
	});
}
//#endregion
export { ProfilePage as component };
