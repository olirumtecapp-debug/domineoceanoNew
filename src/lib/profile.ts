export interface Stats {
  wins: number;
  losses: number;
  shots: number;
  hits: number;
  sunk: number;
  played: number;
  xp: number;
}

export interface Achievement {
  key: string;
  name: string;
  desc: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { key: "first_blood", name: "Primeiro Sangue", desc: "Vença sua primeira batalha." },
  { key: "sniper", name: "Atirador de Elite", desc: "Termine uma partida com 60% de precisão." },
  { key: "hunter", name: "Caçador de Frotas", desc: "Afunde 25 embarcações no total." },
  { key: "admiral", name: "Almirante Supremo", desc: "Vença no nível Almirante Supremo." },
  { key: "veteran", name: "Veterano", desc: "Jogue 20 partidas." },
];

const KEY = "od_profile_v1";

export interface Profile {
  callsign: string;
  stats: Stats;
  achievements: string[];
  history: { date: string; result: "win" | "loss"; difficulty: string; size: number; accuracy: number }[];
}

const EMPTY: Profile = {
  callsign: "Comandante",
  stats: { wins: 0, losses: 0, shots: 0, hits: 0, sunk: 0, played: 0, xp: 0 },
  achievements: [],
  history: [],
};

export function loadProfile(): Profile {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function levelFromXp(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 60)) + 1;
  const current = 60 * (level - 1) ** 2;
  const next = 60 * level ** 2;
  return { level, current, next, progress: Math.min(100, ((xp - current) / (next - current)) * 100) };
}

export function recordMatch(result: {
  win: boolean;
  shots: number;
  hits: number;
  sunk: number;
  difficulty: string;
  size: number;
}) {
  const p = loadProfile();
  const s = p.stats;
  s.played += 1;
  s.shots += result.shots;
  s.hits += result.hits;
  s.sunk += result.sunk;
  if (result.win) s.wins += 1;
  else s.losses += 1;
  const accuracy = result.shots ? Math.round((result.hits / result.shots) * 100) : 0;
  s.xp += (result.win ? 120 : 40) + result.sunk * 15 + Math.round(accuracy / 2);

  const unlocked = new Set(p.achievements);
  if (result.win) unlocked.add("first_blood");
  if (accuracy >= 60 && result.shots >= 10) unlocked.add("sniper");
  if (s.sunk >= 25) unlocked.add("hunter");
  if (result.win && result.difficulty === "almirante") unlocked.add("admiral");
  if (s.played >= 20) unlocked.add("veteran");
  p.achievements = [...unlocked];

  p.history.unshift({
    date: new Date().toISOString(),
    result: result.win ? "win" : "loss",
    difficulty: result.difficulty,
    size: result.size,
    accuracy,
  });
  p.history = p.history.slice(0, 25);
  saveProfile(p);
  return p;
}
