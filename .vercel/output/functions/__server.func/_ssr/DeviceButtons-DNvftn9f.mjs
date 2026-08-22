import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./SupportButton-D6On0mZE.mjs";
import { E as Maximize2, T as Minimize2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DeviceButtons-DNvftn9f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstallButton({ size = "sm" }) {
	return null;
}
function FullscreenButton({ size = "sm" }) {
	const [supported, setSupported] = (0, import_react.useState)(false);
	const [isFs, setIsFs] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const d = document;
		setSupported(Boolean(d.fullscreenEnabled ?? d.webkitFullscreenEnabled));
		const onChange = () => {
			const el = document.fullscreenElement ?? document.webkitFullscreenElement;
			setIsFs(Boolean(el));
		};
		onChange();
		document.addEventListener("fullscreenchange", onChange);
		document.addEventListener("webkitfullscreenchange", onChange);
		return () => {
			document.removeEventListener("fullscreenchange", onChange);
			document.removeEventListener("webkitfullscreenchange", onChange);
		};
	}, []);
	if (!supported) return null;
	const toggle = async () => {
		try {
			const d = document;
			const el = document.documentElement;
			if (isFs) await (d.exitFullscreen?.() ?? d.webkitExitFullscreen?.());
			else await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.());
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size,
		onClick: toggle,
		className: "gap-2",
		children: [isFs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-4 w-4" }), isFs ? "Sair da tela cheia" : "Tela cheia"]
	});
}
//#endregion
export { InstallButton as n, FullscreenButton as t };
