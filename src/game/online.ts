import { supabase } from "@/integrations/supabase/client";
import { autoPlaceFleet, generateTerrain } from "@/game/engine";
import type { MapKey, Ship, Terrain } from "@/game/types";

export type Side = "host" | "guest";

export interface RoomRow {
  id: string;
  code: string;
  size: number;
  map: string;
  terrain: Terrain[];
  host_name: string;
  guest_name: string | null;
  host_ships: Ship[] | null;
  guest_ships: Ship[] | null;
  host_ready: boolean;
  guest_ready: boolean;
  turn: string;
  status: string;
  winner: string | null;
  created_at: string;
}

export interface MoveRow {
  id: number;
  room_id: string;
  by: string;
  cell: number;
  ability: string | null;
  created_at: string;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function randomCode(len = 5) {
  let out = "";
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  for (let i = 0; i < len; i++) out += ALPHABET[buf[i] % ALPHABET.length];
  return out;
}

const KEY = "od_rooms";

type Memory = Record<string, { side: Side; roomId: string }>;

function readMemory(): Memory {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Memory;
  } catch {
    return {};
  }
}

export function rememberSide(code: string, side: Side, roomId: string) {
  const mem = readMemory();
  mem[code.toUpperCase()] = { side, roomId };
  localStorage.setItem(KEY, JSON.stringify(mem));
}

export function recallSide(code: string): Side | null {
  return readMemory()[code.toUpperCase()]?.side ?? null;
}

export async function createRoom(opts: { size: number; map: MapKey; name: string }) {
  const code = randomCode();
  const terrain = generateTerrain(opts.size, opts.map, Date.now() % 100000);
  const { data, error } = await supabase
    .from("rooms")
    .insert({
      code,
      size: opts.size,
      map: opts.map,
      terrain: terrain as unknown as string[],
      host_name: opts.name || "Anfitrião",
    })
    .select()
    .single();
  if (error) throw error;
  rememberSide(code, "host", data.id);
  return data as unknown as RoomRow;
}

export async function fetchRoom(code: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as RoomRow) ?? null;
}

export async function joinRoom(code: string, name: string) {
  const room = await fetchRoom(code);
  if (!room) throw new Error("Sala não encontrada. Confira o código.");
  if (room.guest_name && recallSide(code) !== "guest") {
    if (recallSide(code) === "host") return room;
    throw new Error("Esta sala já está cheia.");
  }
  const { data, error } = await supabase
    .from("rooms")
    .update({ guest_name: name || "Visitante", status: "placing", updated_at: new Date().toISOString() })
    .eq("id", room.id)
    .select()
    .single();
  if (error) throw error;
  rememberSide(code, "guest", room.id);
  return data as unknown as RoomRow;
}

export async function submitFleet(room: RoomRow, side: Side, ships: Ship[]) {
  const patch =
    side === "host"
      ? { host_ships: ships as unknown as string[], host_ready: true }
      : { guest_ships: ships as unknown as string[], guest_ready: true };
  const bothReady = side === "host" ? room.guest_ready : room.host_ready;
  const { error } = await supabase
    .from("rooms")
    .update({ ...patch, status: bothReady ? "battle" : "placing", updated_at: new Date().toISOString() })
    .eq("id", room.id);
  if (error) throw error;
}

export async function sendMove(room: RoomRow, side: Side, cell: number, ability: string | null = null) {
  const { error } = await supabase.from("room_moves").insert({ room_id: room.id, by: side, cell, ability });
  if (error) throw error;
}

export async function finishRoom(room: RoomRow, winner: Side) {
  await supabase
    .from("rooms")
    .update({ status: "over", winner, updated_at: new Date().toISOString() })
    .eq("id", room.id);
}

export async function fetchMoves(roomId: string) {
  const { data, error } = await supabase
    .from("room_moves")
    .select("*")
    .eq("room_id", roomId)
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as MoveRow[];
}

export function suggestFleet(size: number, terrain: Terrain[]) {
  return autoPlaceFleet(size, terrain);
}
