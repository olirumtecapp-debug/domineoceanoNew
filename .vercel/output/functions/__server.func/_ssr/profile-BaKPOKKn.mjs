import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./SupportButton-D6On0mZE.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BaKPOKKn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var ACHIEVEMENTS = [
	{
		key: "first_blood",
		name: "Primeiro Sangue",
		desc: "Vença sua primeira batalha."
	},
	{
		key: "sniper",
		name: "Atirador de Elite",
		desc: "Termine uma partida com 60% de precisão."
	},
	{
		key: "hunter",
		name: "Caçador de Frotas",
		desc: "Afunde 25 embarcações no total."
	},
	{
		key: "admiral",
		name: "Almirante Supremo",
		desc: "Vença no nível Almirante Supremo."
	},
	{
		key: "veteran",
		name: "Veterano",
		desc: "Jogue 20 partidas."
	}
];
var KEY = "od_profile_v1";
var EMPTY = {
	callsign: "Comandante",
	stats: {
		wins: 0,
		losses: 0,
		shots: 0,
		hits: 0,
		sunk: 0,
		played: 0,
		xp: 0
	},
	achievements: [],
	history: []
};
function loadProfile() {
	if (typeof window === "undefined") return EMPTY;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return EMPTY;
		return {
			...EMPTY,
			...JSON.parse(raw)
		};
	} catch {
		return EMPTY;
	}
}
function saveProfile(p) {
	if (typeof window === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(p));
}
function levelFromXp(xp) {
	const level = Math.floor(Math.sqrt(xp / 60)) + 1;
	const current = 60 * (level - 1) ** 2;
	const next = 60 * level ** 2;
	return {
		level,
		current,
		next,
		progress: Math.min(100, (xp - current) / (next - current) * 100)
	};
}
function recordMatch(result) {
	const p = loadProfile();
	const s = p.stats;
	s.played += 1;
	s.shots += result.shots;
	s.hits += result.hits;
	s.sunk += result.sunk;
	if (result.win) s.wins += 1;
	else s.losses += 1;
	const accuracy = result.shots ? Math.round(result.hits / result.shots * 100) : 0;
	s.xp += (result.win ? 120 : 40) + result.sunk * 15 + Math.round(accuracy / 2);
	const unlocked = new Set(p.achievements);
	if (result.win) unlocked.add("first_blood");
	if (accuracy >= 60 && result.shots >= 10) unlocked.add("sniper");
	if (s.sunk >= 25) unlocked.add("hunter");
	if (result.win && result.difficulty === "almirante") unlocked.add("admiral");
	if (s.played >= 20) unlocked.add("veteran");
	p.achievements = [...unlocked];
	p.history.unshift({
		date: (/* @__PURE__ */ new Date()).toISOString(),
		result: result.win ? "win" : "loss",
		difficulty: result.difficulty,
		size: result.size,
		accuracy
	});
	p.history = p.history.slice(0, 25);
	saveProfile(p);
	return p;
}
//#endregion
export { loadProfile as a, levelFromXp as i, Badge as n, recordMatch as o, Progress as r, ACHIEVEMENTS as t };
