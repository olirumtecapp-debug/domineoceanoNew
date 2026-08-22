import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OceanScene-C5SirJvV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PALETTES = {
	clear: {
		sky: ["#0b2b45", "#1d5c86"],
		sea: ["#0d3552", "#061b2c"],
		haze: "rgba(140,200,255,0.06)",
		sun: "rgba(255,220,150,0.35)"
	},
	sunset: {
		sky: ["#2a1a3a", "#c4643a"],
		sea: ["#3a2337", "#0d1622"],
		haze: "rgba(255,170,110,0.10)",
		sun: "rgba(255,180,90,0.5)"
	},
	storm: {
		sky: ["#0a1420", "#22303c"],
		sea: ["#0a1e2c", "#04101a"],
		haze: "rgba(120,140,160,0.10)",
		sun: "rgba(180,200,220,0.12)"
	},
	fog: {
		sky: ["#16242f", "#41586a"],
		sea: ["#132531", "#08151d"],
		haze: "rgba(200,215,225,0.18)",
		sun: "rgba(220,230,240,0.2)"
	},
	night: {
		sky: ["#050b16", "#0d1c33"],
		sea: ["#05121f", "#020a12"],
		haze: "rgba(80,120,180,0.07)",
		sun: "rgba(160,190,255,0.18)"
	}
};
function OceanScene({ weather = "clear", intensity = "cinematic", className }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let w = 0;
		let h = 0;
		let dpr = 1;
		const pal = PALETTES[weather];
		const ships = [
			{
				x: .62,
				y: .56,
				scale: 1.5,
				speed: .0035,
				kind: "carrier"
			},
			{
				x: .2,
				y: .62,
				scale: .9,
				speed: .006,
				kind: "destroyer"
			},
			{
				x: .85,
				y: .68,
				scale: .75,
				speed: -.005,
				kind: "frigate"
			},
			{
				x: .42,
				y: .74,
				scale: .6,
				speed: .004,
				kind: "sub"
			},
			{
				x: .08,
				y: .82,
				scale: .85,
				speed: .007,
				kind: "support"
			},
			{
				x: .7,
				y: .86,
				scale: .4,
				speed: -.003,
				kind: "civil"
			}
		];
		const clouds = Array.from({ length: 7 }, (_, i) => ({
			x: Math.random(),
			y: .05 + Math.random() * .25,
			s: .5 + Math.random() * 1.2,
			v: 4e-4 + Math.random() * 8e-4,
			k: i
		}));
		const aircraft = [];
		const blasts = [];
		const rain = Array.from({ length: weather === "storm" ? 220 : 0 }, () => ({
			x: Math.random(),
			y: Math.random(),
			v: .012 + Math.random() * .02
		}));
		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener("resize", resize);
		const drawShip = (e, t) => {
			const px = e.x * w;
			const bob = Math.sin(t * .001 + e.x * 10) * 2 * e.scale;
			const py = e.y * h + bob;
			const s = e.scale * Math.max(.55, w / 1200);
			ctx.save();
			ctx.translate(px, py);
			ctx.scale(e.speed < 0 ? -s : s, s);
			ctx.fillStyle = weather === "night" ? "rgba(8,16,28,0.95)" : "rgba(10,22,34,0.88)";
			ctx.beginPath();
			switch (e.kind) {
				case "carrier":
					ctx.moveTo(-120, 0);
					ctx.lineTo(120, 0);
					ctx.lineTo(105, 16);
					ctx.lineTo(-100, 16);
					ctx.closePath();
					ctx.fill();
					ctx.fillRect(-118, -10, 236, 10);
					ctx.fillRect(20, -34, 22, 26);
					ctx.fillRect(28, -52, 4, 20);
					break;
				case "destroyer":
					ctx.moveTo(-70, 0);
					ctx.lineTo(70, 0);
					ctx.lineTo(58, 12);
					ctx.lineTo(-58, 12);
					ctx.closePath();
					ctx.fill();
					ctx.fillRect(-16, -22, 30, 22);
					ctx.fillRect(-4, -40, 6, 20);
					break;
				case "frigate":
					ctx.moveTo(-52, 0);
					ctx.lineTo(52, 0);
					ctx.lineTo(42, 10);
					ctx.lineTo(-42, 10);
					ctx.closePath();
					ctx.fill();
					ctx.fillRect(-10, -18, 22, 18);
					break;
				case "sub":
					ctx.ellipse(0, 4, 46, 8, 0, 0, Math.PI * 2);
					ctx.fill();
					ctx.fillRect(-6, -14, 14, 16);
					break;
				case "support":
					ctx.moveTo(-58, 0);
					ctx.lineTo(58, 0);
					ctx.lineTo(48, 14);
					ctx.lineTo(-48, 14);
					ctx.closePath();
					ctx.fill();
					ctx.fillRect(24, -20, 24, 20);
					break;
				case "civil":
					ctx.moveTo(-22, 0);
					ctx.lineTo(22, 0);
					ctx.lineTo(16, 7);
					ctx.lineTo(-16, 7);
					ctx.closePath();
					ctx.fill();
					ctx.fillRect(-4, -10, 8, 10);
			}
			ctx.restore();
			ctx.fillStyle = "rgba(200,230,255,0.10)";
			ctx.fillRect(px - 90 * s, py + 12 * s, 180 * s, 2);
		};
		const render = (t) => {
			const sky = ctx.createLinearGradient(0, 0, 0, h * .62);
			sky.addColorStop(0, pal.sky[0]);
			sky.addColorStop(1, pal.sky[1]);
			ctx.fillStyle = sky;
			ctx.fillRect(0, 0, w, h * .62);
			const cx = w * .72;
			const cy = h * .16;
			const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * .7);
			g.addColorStop(0, pal.sun);
			g.addColorStop(1, "rgba(0,0,0,0)");
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, w, h * .8);
			if (weather === "night") {
				ctx.fillStyle = "rgba(255,255,255,0.7)";
				for (let i = 0; i < 60; i++) {
					const sx = i * 137.5 % 100 / 100 * w;
					const sy = i * 73.3 % 45 / 100 * h;
					ctx.globalAlpha = .2 + .5 * Math.abs(Math.sin(t * 5e-4 + i));
					ctx.fillRect(sx, sy, 1.4, 1.4);
				}
				ctx.globalAlpha = 1;
			}
			for (const c of clouds) {
				c.x += reduced ? 0 : c.v;
				if (c.x > 1.25) c.x = -.25;
				const px = c.x * w;
				const py = c.y * h;
				ctx.fillStyle = weather === "storm" ? "rgba(30,44,58,0.85)" : "rgba(255,255,255,0.09)";
				ctx.beginPath();
				for (let i = 0; i < 4; i++) ctx.ellipse(px + i * 42 * c.s, py + Math.sin(i) * 8, 52 * c.s, 20 * c.s, 0, 0, Math.PI * 2);
				ctx.fill();
			}
			const sea = ctx.createLinearGradient(0, h * .55, 0, h);
			sea.addColorStop(0, pal.sea[0]);
			sea.addColorStop(1, pal.sea[1]);
			ctx.fillStyle = sea;
			ctx.fillRect(0, h * .55, w, h * .45);
			for (let layer = 0; layer < 4; layer++) {
				ctx.beginPath();
				const base = h * (.58 + layer * .1);
				ctx.moveTo(0, base);
				for (let x = 0; x <= w; x += 12) {
					const y = base + Math.sin(x * .012 + t * 9e-4 * (layer + 1)) * (3 + layer * 2) + Math.sin(x * .03 + t * .0015) * 1.6;
					ctx.lineTo(x, y);
				}
				ctx.lineTo(w, h);
				ctx.lineTo(0, h);
				ctx.closePath();
				ctx.fillStyle = `rgba(120,190,235,${.035 + layer * .012})`;
				ctx.fill();
			}
			ctx.fillStyle = "rgba(60,70,80,0.25)";
			[
				.14,
				.55,
				.9
			].forEach((fx, i) => {
				const bx = fx * w;
				for (let k = 0; k < 6; k++) {
					const yy = h * .55 - k * 14 - Math.sin(t * 8e-4 + i + k) * 4;
					ctx.beginPath();
					ctx.ellipse(bx + Math.sin(t * 6e-4 + k) * 8, yy, 10 + k * 3, 6 + k * 2, 0, 0, Math.PI * 2);
					ctx.fill();
				}
			});
			for (const s of ships) {
				if (!reduced) {
					s.x += s.speed * .0016;
					if (s.x > 1.2) s.x = -.2;
					if (s.x < -.2) s.x = 1.2;
				}
				drawShip(s, t);
			}
			if (intensity === "cinematic" && !reduced && Math.random() < .006 && aircraft.length < 5) {
				const types = [
					"jet",
					"heli",
					"missile",
					"gull"
				];
				const type = types[Math.floor(Math.random() * types.length)];
				aircraft.push({
					x: Math.random() < .5 ? -.1 : 1.1,
					y: .1 + Math.random() * .3,
					v: (Math.random() < .5 ? 1 : -1) * (type === "jet" ? .006 : type === "missile" ? .008 : .0018),
					type
				});
			}
			for (let i = aircraft.length - 1; i >= 0; i--) {
				const a = aircraft[i];
				a.x += a.v;
				if (a.x < -.2 || a.x > 1.2) {
					aircraft.splice(i, 1);
					continue;
				}
				const px = a.x * w;
				const py = a.y * h + Math.sin(t * .004 + i) * (a.type === "heli" ? 3 : 1);
				ctx.save();
				ctx.translate(px, py);
				ctx.scale(a.v < 0 ? -1 : 1, 1);
				ctx.fillStyle = a.type === "gull" ? "rgba(240,245,250,0.6)" : "rgba(12,20,30,0.9)";
				if (a.type === "jet") {
					ctx.beginPath();
					ctx.moveTo(-14, 0);
					ctx.lineTo(12, 0);
					ctx.lineTo(2, 5);
					ctx.lineTo(-4, 2);
					ctx.closePath();
					ctx.fill();
					ctx.fillStyle = "rgba(255,180,90,0.35)";
					ctx.fillRect(-30, 0, 16, 1.6);
				} else if (a.type === "heli") {
					ctx.fillRect(-10, -2, 18, 5);
					ctx.fillRect(-16, 0, 10, 2);
					ctx.fillRect(-14, -7, 28, 1.4);
				} else if (a.type === "missile") {
					ctx.fillRect(-8, 0, 12, 2.5);
					ctx.fillStyle = "rgba(255,150,80,0.5)";
					ctx.fillRect(-34, .4, 26, 1.6);
				} else {
					ctx.beginPath();
					ctx.moveTo(-6, 0);
					ctx.quadraticCurveTo(0, -4, 6, 0);
					ctx.quadraticCurveTo(0, -1, -6, 0);
					ctx.fill();
				}
				ctx.restore();
			}
			if (intensity === "cinematic" && !reduced && Math.random() < .004) blasts.push({
				x: Math.random(),
				y: .5 + Math.random() * .06,
				t: 0,
				big: Math.random() < .3
			});
			for (let i = blasts.length - 1; i >= 0; i--) {
				const b = blasts[i];
				b.t += .02;
				if (b.t > 1) {
					blasts.splice(i, 1);
					continue;
				}
				const r = (b.big ? 46 : 24) * b.t;
				const bg = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, r);
				bg.addColorStop(0, `rgba(255,230,160,${.9 * (1 - b.t)})`);
				bg.addColorStop(.5, `rgba(255,140,60,${.6 * (1 - b.t)})`);
				bg.addColorStop(1, "rgba(0,0,0,0)");
				ctx.fillStyle = bg;
				ctx.beginPath();
				ctx.arc(b.x * w, b.y * h, r, 0, Math.PI * 2);
				ctx.fill();
			}
			if (rain.length) {
				ctx.strokeStyle = "rgba(180,210,235,0.25)";
				ctx.lineWidth = 1;
				ctx.beginPath();
				for (const d of rain) {
					d.y += d.v;
					d.x += .002;
					if (d.y > 1) {
						d.y = -.05;
						d.x = Math.random();
					}
					ctx.moveTo(d.x * w, d.y * h);
					ctx.lineTo(d.x * w - 4, d.y * h + 12);
				}
				ctx.stroke();
			}
			ctx.fillStyle = pal.haze;
			ctx.fillRect(0, 0, w, h);
			raf = requestAnimationFrame(render);
		};
		raf = requestAnimationFrame(render);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, [weather, intensity]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className,
		"aria-hidden": true
	});
}
//#endregion
export { OceanScene as t };
