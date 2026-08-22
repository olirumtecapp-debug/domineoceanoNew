import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./SupportButton-D6On0mZE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Logo-Ba7NMInR.js
var import_jsx_runtime = require_jsx_runtime();
function Logo({ className, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-3", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: compact ? "h-9 w-9" : "h-14 w-14",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "odg",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "oklch(0.88 0.13 88)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "oklch(0.66 0.15 60)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "odb",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "oklch(0.78 0.14 215)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "oklch(0.42 0.12 240)"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M32 3 58 13v20c0 15-11 25-26 28C17 58 6 48 6 33V13z",
					fill: "url(#odb)",
					opacity: "0.9"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M32 3 58 13v20c0 15-11 25-26 28C17 58 6 48 6 33V13z",
					fill: "none",
					stroke: "url(#odg)",
					strokeWidth: "2.5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M13 40c5 3 8-3 13 0s8-3 13 0 8-3 12 0",
					fill: "none",
					stroke: "oklch(0.95 0.02 220)",
					strokeWidth: "2.4",
					strokeLinecap: "round",
					opacity: "0.85"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M32 14v16M24 30h16l-8 8z",
					fill: "url(#odg)",
					stroke: "url(#odg)",
					strokeWidth: "1.6",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "32",
					cy: "12",
					r: "3",
					fill: "url(#odg)"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-black uppercase tracking-[0.18em] text-gradient-gold", compact ? "text-base" : "text-2xl sm:text-4xl"),
				children: "Ocean"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-black uppercase tracking-[0.32em] text-foreground/90", compact ? "text-[10px]" : "text-lg sm:text-2xl"),
				children: "Dominion"
			})]
		})]
	});
}
//#endregion
export { Logo as t };
