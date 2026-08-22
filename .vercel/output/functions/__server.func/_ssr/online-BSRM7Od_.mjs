import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./SupportButton-D6On0mZE.mjs";
import { t as supabase } from "./client-Su2Se3-N.mjs";
import { c as generateTerrain } from "./engine-DF6RRqDJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/online-BSRM7Od_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomCode(len = 5) {
	let out = "";
	const buf = new Uint32Array(len);
	crypto.getRandomValues(buf);
	for (let i = 0; i < len; i++) out += ALPHABET[buf[i] % 32];
	return out;
}
var KEY = "od_rooms";
function readMemory() {
	if (typeof window === "undefined") return {};
	try {
		return JSON.parse(localStorage.getItem(KEY) ?? "{}");
	} catch {
		return {};
	}
}
function rememberSide(code, side, roomId) {
	const mem = readMemory();
	mem[code.toUpperCase()] = {
		side,
		roomId
	};
	localStorage.setItem(KEY, JSON.stringify(mem));
}
function recallSide(code) {
	return readMemory()[code.toUpperCase()]?.side ?? null;
}
async function createRoom(opts) {
	const code = randomCode();
	const terrain = generateTerrain(opts.size, opts.map, Date.now() % 1e5);
	const { data, error } = await supabase.from("rooms").insert({
		code,
		size: opts.size,
		map: opts.map,
		terrain,
		host_name: opts.name || "Anfitrião"
	}).select().single();
	if (error) throw error;
	rememberSide(code, "host", data.id);
	return data;
}
async function fetchRoom(code) {
	const { data, error } = await supabase.from("rooms").select("*").eq("code", code.toUpperCase()).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
async function joinRoom(code, name) {
	const room = await fetchRoom(code);
	if (!room) throw new Error("Sala não encontrada. Confira o código.");
	if (room.guest_name && recallSide(code) !== "guest") {
		if (recallSide(code) === "host") return room;
		throw new Error("Esta sala já está cheia.");
	}
	const { data, error } = await supabase.from("rooms").update({
		guest_name: name || "Visitante",
		status: "placing",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", room.id).select().single();
	if (error) throw error;
	rememberSide(code, "guest", room.id);
	return data;
}
async function submitFleet(room, side, ships) {
	const patch = side === "host" ? {
		host_ships: ships,
		host_ready: true
	} : {
		guest_ships: ships,
		guest_ready: true
	};
	const bothReady = side === "host" ? room.guest_ready : room.host_ready;
	const { error } = await supabase.from("rooms").update({
		...patch,
		status: bothReady ? "battle" : "placing",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", room.id);
	if (error) throw error;
}
async function sendMove(room, side, cell, ability = null) {
	const { error } = await supabase.from("room_moves").insert({
		room_id: room.id,
		by: side,
		cell,
		ability
	});
	if (error) throw error;
}
async function finishRoom(room, winner) {
	await supabase.from("rooms").update({
		status: "over",
		winner,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", room.id);
}
async function fetchMoves(roomId) {
	const { data, error } = await supabase.from("room_moves").select("*").eq("room_id", roomId).order("id", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
//#endregion
export { finishRoom as a, sendMove as c, fetchRoom as i, submitFleet as l, createRoom as n, joinRoom as o, fetchMoves as r, recallSide as s, Input as t };
