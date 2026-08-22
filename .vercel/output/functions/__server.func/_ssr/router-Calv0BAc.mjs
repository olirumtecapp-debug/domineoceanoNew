import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Link, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { n as objectType, r as stringType, t as coerce } from "../_libs/zod.mjs";
import { n as __exportAll } from "./server-DNI-Jgkc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Calv0BAc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CS4SmMKV.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "Ocean Dominion — Estratégia Naval por Turnos" },
			{
				name: "description",
				content: "Comande uma frota de elite em batalhas navais por turnos contra IA em 6 níveis. Radar, sonar, mísseis guiados e combate cinematográfico no celular ou no PC."
			},
			{
				name: "author",
				content: "Murilo Ferreira da Silva"
			},
			{
				name: "theme-color",
				content: "#0a1626"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Ocean Dominion"
			},
			{
				property: "og:title",
				content: "Ocean Dominion — Estratégia Naval por Turnos"
			},
			{
				property: "og:description",
				content: "Comande uma frota de elite em batalhas navais por turnos contra IA em 6 níveis. Radar, sonar, mísseis guiados e combate cinematográfico no celular ou no PC."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Ocean Dominion — Estratégia Naval por Turnos"
			},
			{
				name: "twitter:description",
				content: "Comande uma frota de elite em batalhas navais por turnos contra IA em 6 níveis. Radar, sonar, mísseis guiados e combate cinematográfico no celular ou no PC."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2cb8626c-b001-42e9-b302-380e4833836f/id-preview-063e46ab--4084f102-a61f-42f1-a9ed-a7a2c9af6d9c.lovable.app-1785347809147.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2cb8626c-b001-42e9-b302-380e4833836f/id-preview-063e46ab--4084f102-a61f-42f1-a9ed-a7a2c9af6d9c.lovable.app-1785347809147.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/icon-192.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				src: "https://projetoij.lovable.app/api/public/pij.js",
				"data-project": "bananabn",
				defer: true
			})
		] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-DltOhPV4.mjs");
var Route$6 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Ocean Dominion — Estratégia Naval por Turnos" },
		{
			name: "description",
			content: "Comande uma frota de elite em batalhas navais por turnos contra IA em 6 níveis. Radar, sonar, mísseis guiados e combate cinematográfico no celular ou no PC."
		},
		{
			property: "og:title",
			content: "Ocean Dominion — Estratégia Naval por Turnos"
		},
		{
			property: "og:description",
			content: "Comande uma frota de elite em batalhas navais por turnos contra IA em 6 níveis. Radar, sonar, mísseis guiados e combate cinematográfico no celular ou no PC."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./como-jogar-o8EXBYVT.mjs");
var Route$5 = createFileRoute("/como-jogar")({
	head: () => ({ meta: [
		{ title: "Como jogar — Ocean Dominion" },
		{
			name: "description",
			content: "Regras, frota, habilidades especiais e como instalar o Ocean Dominion no celular, tablet, notebook ou PC."
		},
		{
			property: "og:title",
			content: "Como jogar — Ocean Dominion"
		},
		{
			property: "og:description",
			content: "Aprenda as regras do combate naval e instale o jogo em qualquer dispositivo."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./jogar-Dl01LwPp.mjs");
var Route$4 = createFileRoute("/jogar")({
	head: () => ({ meta: [
		{ title: "Preparar batalha — Ocean Dominion" },
		{
			name: "description",
			content: "Escolha o tamanho do oceano, o mapa e o nível do adversário antes de zarpar para o combate naval."
		},
		{
			property: "og:title",
			content: "Preparar batalha — Ocean Dominion"
		},
		{
			property: "og:description",
			content: "Configure tabuleiro, mapa e dificuldade da sua próxima batalha naval."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./online-CcMmnf8f.mjs");
var Route$3 = createFileRoute("/online")({
	head: () => ({ meta: [
		{ title: "Batalha online — Ocean Dominion" },
		{
			name: "description",
			content: "Crie uma sala, compartilhe o código e enfrente outro comandante em tempo real no oceano."
		},
		{
			property: "og:title",
			content: "Batalha online — Ocean Dominion"
		},
		{
			property: "og:description",
			content: "Salas com código para duelos navais em tempo real."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./partida-VUcyJ8G1.mjs");
var searchSchema = objectType({
	size: coerce.number().min(8).max(12).catch(10),
	map: stringType().catch("mar_aberto"),
	difficulty: stringType().catch("normal")
});
var Route$2 = createFileRoute("/partida")({
	validateSearch: searchSchema,
	head: () => ({ meta: [
		{ title: "Batalha em curso — Ocean Dominion" },
		{
			name: "description",
			content: "Comande sua frota, use radar, sonar e mísseis guiados e afunde a esquadra inimiga."
		},
		{
			property: "og:title",
			content: "Batalha em curso — Ocean Dominion"
		},
		{
			property: "og:description",
			content: "Estratégia naval por turnos com habilidades táticas e combate cinematográfico."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./perfil-BFkrHtx2.mjs");
var Route$1 = createFileRoute("/perfil")({
	head: () => ({ meta: [
		{ title: "Perfil do Comandante — Ocean Dominion" },
		{
			name: "description",
			content: "Acompanhe nível, XP, precisão, conquistas e histórico das suas batalhas navais."
		},
		{
			property: "og:title",
			content: "Perfil do Comandante — Ocean Dominion"
		},
		{
			property: "og:description",
			content: "Estatísticas, conquistas e histórico de confrontos da sua frota."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./sala._code-0qBQkbLo.mjs");
var Route = createFileRoute("/sala/$code")({
	head: () => ({ meta: [
		{ title: "Sala de batalha — Ocean Dominion" },
		{
			name: "description",
			content: "Duelo naval em tempo real contra outro comandante."
		},
		{
			property: "og:title",
			content: "Sala de batalha — Ocean Dominion"
		},
		{
			property: "og:description",
			content: "Entre com o código da sala e enfrente outro comandante."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	ComoJogarRoute: Route$5.update({
		id: "/como-jogar",
		path: "/como-jogar",
		getParentRoute: () => Route$7
	}),
	JogarRoute: Route$4.update({
		id: "/jogar",
		path: "/jogar",
		getParentRoute: () => Route$7
	}),
	OnlineRoute: Route$3.update({
		id: "/online",
		path: "/online",
		getParentRoute: () => Route$7
	}),
	PartidaRoute: Route$2.update({
		id: "/partida",
		path: "/partida",
		getParentRoute: () => Route$7
	}),
	PerfilRoute: Route$1.update({
		id: "/perfil",
		path: "/perfil",
		getParentRoute: () => Route$7
	}),
	SalaCodeRoute: Route.update({
		id: "/sala/$code",
		path: "/sala/$code",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route as n, Route$2 as r, router_exports as t };
