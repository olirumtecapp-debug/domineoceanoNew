import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SupportButton, r as cn, t as Button } from "./SupportButton-D6On0mZE.mjs";
import { t as Logo } from "./Logo-Ba7NMInR.mjs";
import { D as LoaderCircle, M as DoorOpen, R as Anchor, k as House } from "../_libs/lucide-react.mjs";
import { t as MAP_IMAGES } from "./assets-CoqDvaie.mjs";
import { r as MAPS } from "./fleet-BFcBnVZD.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as OceanScene } from "./OceanScene-C5SirJvV.mjs";
import { n as createRoom, o as joinRoom, t as Input } from "./online-BSRM7Od_.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/online-CcMmnf8f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OnlinePage() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [size, setSize] = (0, import_react.useState)(10);
	const [map, setMap] = (0, import_react.useState)("arquipelago");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const handleCreate = async () => {
		setBusy("create");
		try {
			const room = await createRoom({
				size,
				map,
				name
			});
			navigate({
				to: "/sala/$code",
				params: { code: room.code }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Não foi possível criar a sala.");
			setBusy(null);
		}
	};
	const handleJoin = async () => {
		if (code.trim().length < 4) {
			toast.error("Digite o código da sala.");
			return;
		}
		setBusy("join");
		try {
			const room = await joinRoom(code.trim().toUpperCase(), name);
			navigate({
				to: "/sala/$code",
				params: { code: room.code }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Não foi possível entrar na sala.");
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OceanScene, {
				weather: "storm",
				intensity: "cinematic",
				className: "pointer-events-none absolute inset-0 h-full w-full opacity-70"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-background/60" }),
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
						children: "Batalha online"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Crie uma sala e envie o código para o seu adversário, ou entre com o código que recebeu."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 rounded-xl panel-metal p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-bold uppercase tracking-widest text-muted-foreground",
							children: "Seu nome de guerra"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							maxLength: 20,
							onChange: (e) => setName(e.target.value),
							placeholder: "Comandante",
							className: "mt-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl panel-metal p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "flex items-center gap-2 text-lg font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, { className: "h-5 w-5 text-primary" }), " Criar sala"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground",
									children: "Tamanho do oceano"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex gap-2",
									children: [
										8,
										10,
										12
									].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setSize(n),
										className: cn("flex-1 rounded-lg border border-border py-2 text-sm font-semibold transition-colors", size === n ? "border-primary bg-primary/20" : "hover:bg-muted/40"),
										children: [
											n,
											"x",
											n
										]
									}, n))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground",
									children: "Cenário"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid grid-cols-3 gap-2",
									children: MAPS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setMap(m.key),
										className: cn("overflow-hidden rounded-lg border border-border text-left transition-all", map === m.key ? "border-primary ring-1 ring-primary" : "hover:opacity-90"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: MAP_IMAGES[m.key],
											alt: "",
											"aria-hidden": true,
											loading: "lazy",
											className: "h-12 w-full object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate px-1.5 py-1 text-[10px] font-semibold",
											children: m.name
										})]
									}, m.key))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "mt-4 w-full gap-2",
									onClick: handleCreate,
									disabled: busy !== null,
									children: [busy === "create" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, { className: "h-4 w-4" }), "Criar sala e gerar código"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl panel-metal p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "flex items-center gap-2 text-lg font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorOpen, { className: "h-5 w-5 text-accent" }), " Entrar em uma sala"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Peça o código de 5 caracteres ao comandante que criou a batalha."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: code,
									onChange: (e) => setCode(e.target.value.toUpperCase()),
									maxLength: 5,
									placeholder: "XXXXX",
									className: "mt-4 text-center font-mono text-2xl tracking-[0.4em] uppercase"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									className: "mt-4 w-full gap-2",
									onClick: handleJoin,
									disabled: busy !== null,
									children: [busy === "join" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorOpen, { className: "h-4 w-4" }), "Entrar na batalha"]
								})
							]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { OnlinePage as component };
