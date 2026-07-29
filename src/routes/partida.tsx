import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  Radar,
  Waves,
  Rocket,
  Plane,
  Cloud,
  Radio,
  RotateCw,
  Shuffle,
  Play,
  Home,
  Volume2,
  VolumeX,
  Trophy,
  Skull,
} from "lucide-react";
import { toast } from "sonner";

import { Board } from "@/components/game/Board";
import { OceanScene } from "@/components/ocean/OceanScene";
import { FullscreenButton } from "@/components/ocean/DeviceButtons";
import { SupportButton } from "@/components/ocean/SupportButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { aiDecide } from "@/game/ai";
import {
  allSunk,
  autoPlaceFleet,
  canPlace,
  coordLabel,
  createPlayer,
  generateTerrain,
  makeShip,
  remainingSections,
  resolveShot,
  shipCells,
  idx,
  xy,
} from "@/game/engine";
import { ABILITIES, DIFFICULTIES, MAPS, fleetForSize } from "@/game/fleet";
import { fx } from "@/game/fx";
import { MAP_IMAGES, SHIP_SPRITES } from "@/game/assets";
import type { AbilityKey, Difficulty, LogEntry, MapKey, Orientation, PlayerState, Ship, Terrain } from "@/game/types";
import { audio } from "@/lib/audio";
import { recordMatch } from "@/lib/profile";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  size: z.coerce.number().min(8).max(12).catch(10),
  map: z.string().catch("mar_aberto"),
  difficulty: z.string().catch("normal"),
  mode: z.enum(["ai", "local"]).catch("ai"),
});

export const Route = createFileRoute("/partida")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Batalha em curso — Ocean Dominion" },
      { name: "description", content: "Comande sua frota, use radar, sonar e mísseis guiados e afunde a esquadra inimiga." },
      { property: "og:title", content: "Batalha em curso — Ocean Dominion" },
      { property: "og:description", content: "Estratégia naval por turnos com habilidades táticas e combate cinematográfico." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MatchPage,
});

const ABILITY_ICONS: Record<string, typeof Radar> = {
  radar: Radar,
  sonar: Waves,
  missile: Rocket,
  airstrike: Plane,
  smoke: Cloud,
  drone: Radio,
};

type Phase = "placing" | "battle" | "over";

interface GameState {
  terrain: Terrain[];
  p1: PlayerState;
  p2: PlayerState;
  turn: "p1" | "p2";
  phase: Phase;
  winner: "p1" | "p2" | null;
  log: LogEntry[];
  shots: number;
  hits: number;
  sunk: number;
  turnCount: number;
}

function MatchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const size = search.size;
  const map = search.map as MapKey;
  const difficulty = search.difficulty as Difficulty;

  const terrain = useMemo(() => generateTerrain(size, map, size + map.length), [size, map]);
  const fleet = useMemo(() => fleetForSize(size), [size]);

  const [, force] = useState(0);
  const rerender = useCallback(() => force((v) => v + 1), []);
  const state = useRef<GameState>({
    terrain,
    p1: createPlayer("Você", size, []),
    p2: createPlayer("Frota Inimiga", size, autoPlaceFleet(size, terrain)),
    turn: "p1",
    phase: "placing",
    winner: null,
    log: [],
    shots: 0,
    hits: 0,
    sunk: 0,
    turnCount: 0,
  });

  const [selectedShipIdx, setSelectedShipIdx] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>("h");
  const [ability, setAbility] = useState<AbilityKey | null>(null);
  const [shake, setShake] = useState(false);
  const [muted, setMuted] = useState(false);
  const logId = useRef(1);

  useEffect(() => {
    audio.load();
    setMuted(audio.settings.muted);
    audio.resume();
    return () => audio.stopMusic();
  }, []);

  // reset when config changes
  useEffect(() => {
    state.current = {
      terrain,
      p1: createPlayer("Você", size, []),
      p2: createPlayer("Frota Inimiga", size, autoPlaceFleet(size, terrain)),
      turn: "p1",
      phase: "placing",
      winner: null,
      log: [],
      shots: 0,
      hits: 0,
      sunk: 0,
      turnCount: 0,
    };
    setSelectedShipIdx(0);
    rerender();
  }, [terrain, size, rerender]);

  const s = state.current;
  const placedKeys = s.p1.ships.map((sh) => sh.key);
  const pending = fleet.filter((f, i) => !s.p1.ships.some((ps) => ps.id.startsWith(`${f.key}-`) && placedKeys.indexOf(f.key) === i) );
  const remainingDefs = useMemo(() => {
    const counts = new Map<string, number>();
    s.p1.ships.forEach((sh) => counts.set(sh.key, (counts.get(sh.key) ?? 0) + 1));
    const left: typeof fleet = [];
    const used = new Map<string, number>();
    for (const def of fleet) {
      const u = used.get(def.key) ?? 0;
      if (u < (counts.get(def.key) ?? 0)) used.set(def.key, u + 1);
      else left.push(def);
    }
    return left;
  }, [fleet, s.p1.ships.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const pushLog = (who: "p1" | "p2", text: string, kind: LogEntry["kind"]) => {
    s.log.unshift({ id: logId.current++, who, text, kind });
    s.log = s.log.slice(0, 40);
  };

  // ---------- placement ----------
  const placeAt = (i: number) => {
    const def = remainingDefs[Math.min(selectedShipIdx, remainingDefs.length - 1)];
    if (!def) return;
    const cells = shipCells(size, i, def.size, orientation);
    if (!cells || !canPlace(size, terrain, s.p1.ships, cells)) {
      toast.error("Posição inválida para essa embarcação.");
      return;
    }
    s.p1.ships.push(makeShip(def, cells));
    audio.play("click");
    setSelectedShipIdx(0);
    rerender();
  };

  const autoPlace = () => {
    s.p1.ships = autoPlaceFleet(size, terrain);
    audio.play("click");
    rerender();
  };

  const clearPlacement = () => {
    s.p1.ships = [];
    rerender();
  };

  const startBattle = () => {
    if (remainingDefs.length) {
      toast.error("Posicione toda a frota antes de zarpar.");
      return;
    }
    s.phase = "battle";
    pushLog("p1", "Frota posicionada. Combate iniciado!", "info");
    audio.resume();
    audio.startMusic();
    audio.play("siren");
    rerender();
  };

  // ---------- combat ----------
  const endMatch = (winner: "p1" | "p2") => {
    s.phase = "over";
    s.winner = winner;
    audio.stopMusic();
    audio.play(winner === "p1" ? "victory" : "defeat");
    recordMatch({
      win: winner === "p1",
      shots: s.shots,
      hits: s.hits,
      sunk: s.sunk,
      difficulty,
      size,
    });
  };

  const applyShot = (attacker: "p1" | "p2", index: number, silent = false) => {
    const atk = attacker === "p1" ? s.p1 : s.p2;
    const def = attacker === "p1" ? s.p2 : s.p1;
    if (atk.knowledge[index].shot) return;
    const out = resolveShot(def, terrain, index);
    atk.knowledge[index] = { ...atk.knowledge[index], shot: true, result: out.result };
    def.incoming[index] = { shot: true, result: out.result };
    if (attacker === "p1") {
      s.shots++;
      if (out.result !== "miss") s.hits++;
    }
    const label = coordLabel(size, index);
    const board = attacker === "p1" ? "enemy" : "own";
    if (out.result === "miss") {
      if (!silent) audio.play("miss");
      fx(board, index, "splash");
      pushLog(attacker, `${atk.name}: tiro na água em ${label}.`, "miss");
    } else {
      const justSunk = out.ship?.sunk;
      if (justSunk) {
        if (attacker === "p1") s.sunk++;
        if (!silent) audio.play("sunk");
        pushLog(attacker, `${out.ship!.name} AFUNDADO em ${label}!`, "sunk");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        // mark all its cells
        out.ship!.cells.forEach((c, k) => {
          atk.knowledge[c] = { ...atk.knowledge[c], shot: true, result: "sunk" };
          def.incoming[c] = { shot: true, result: "sunk" };
          setTimeout(() => fx(board, c, "sunk"), k * 110);
        });
      } else {
        if (!silent) audio.play("hit");
        fx(board, index, "explosion");
        pushLog(attacker, `Impacto confirmado em ${label}!`, "hit");
      }
    }
    return out.result;
  };

  const nextTurn = () => {
    const cur = s.turn === "p1" ? s.p1 : s.p2;
    (Object.keys(cur.cooldowns) as AbilityKey[]).forEach((k) => {
      cur.cooldowns[k] = Math.max(0, cur.cooldowns[k] - 1);
    });
    if (cur.smokeTurns > 0) cur.smokeTurns--;
    s.turnCount++;
    if (allSunk(s.p2)) return endMatch("p1");
    if (allSunk(s.p1)) return endMatch("p2");
    s.turn = s.turn === "p1" ? "p2" : "p1";
  };

  const useAbility = (attacker: "p1" | "p2", key: AbilityKey, index: number) => {
    const atk = attacker === "p1" ? s.p1 : s.p2;
    const def = attacker === "p1" ? s.p2 : s.p1;
    const conf = ABILITIES.find((a) => a.key === key)!;
    atk.cooldowns[key] = conf.cooldown;
    const { x, y } = xy(size, index);
    const board = attacker === "p1" ? "enemy" : "own";
    if (key === "radar" || key === "sonar" || key === "drone") fx(board, index, "scan");
    switch (key) {
      case "radar": {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
            const i = idx(size, nx, ny);
            atk.knowledge[i] = { ...atk.knowledge[i], revealed: true };
            if (def.ships.some((sh) => sh.cells.includes(i) && !sh.sunk)) count++;
          }
        audio.play("radar");
        pushLog(attacker, `Radar em ${coordLabel(size, index)}: ${count} seção(ões) detectada(s).`, "ability");
        break;
      }
      case "sonar": {
        const rowCells = Array.from({ length: size }, (_, k) => idx(size, k, y));
        const target = rowCells.find((i) => def.ships.some((sh) => sh.cells.includes(i) && !sh.sunk) && !atk.knowledge[i].shot);
        audio.play("radar");
        if (target !== undefined) {
          atk.knowledge[target] = { ...atk.knowledge[target], revealed: true, revealedShip: true };
          pushLog(attacker, `Sonar detectou contato em ${coordLabel(size, target)}.`, "ability");
        } else {
          pushLog(attacker, `Sonar na linha ${y + 1}: nenhum contato.`, "ability");
        }
        break;
      }
      case "missile": {
        applyShot(attacker, index);
        const around = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ]
          .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size)
          .map(([nx, ny]) => idx(size, nx, ny))
          .filter((i) => !atk.knowledge[i].shot && terrain[i] === "water");
        if (around.length) applyShot(attacker, around[Math.floor(Math.random() * around.length)]);
        pushLog(attacker, "Míssil guiado disparado!", "ability");
        break;
      }
      case "airstrike": {
        pushLog(attacker, "Ataque aéreo autorizado!", "ability");
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= size) continue;
          const i = idx(size, nx, y);
          if (!atk.knowledge[i].shot && terrain[i] === "water") applyShot(attacker, i, dx !== 0);
        }
        break;
      }
      case "smoke": {
        atk.smokeTurns = 2;
        pushLog(attacker, "Cortina de fumaça ativada por 2 turnos.", "ability");
        break;
      }
      case "drone": {
        const around: number[] = [];
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
            const i = idx(size, nx, ny);
            if (!atk.knowledge[i].shot && !def.ships.some((sh) => sh.cells.includes(i))) around.push(i);
          }
        around.slice(0, 3).forEach((i) => {
          atk.knowledge[i] = { ...atk.knowledge[i], shot: true, result: "miss" };
        });
        pushLog(attacker, `Drone confirmou ${Math.min(3, around.length)} célula(s) vazia(s).`, "ability");
        break;
      }
      default:
        break;
    }
  };

  const playerFire = (index: number) => {
    if (s.phase !== "battle" || s.turn !== "p1") return;
    if (ability) {
      const conf = ABILITIES.find((a) => a.key === ability)!;
      if (s.p1.cooldowns[ability] > 0) return;
      useAbility("p1", ability, index);
      setAbility(null);
      if (conf.key !== "smoke") {
        /* consumed turn */
      }
      nextTurn();
      rerender();
      return;
    }
    audio.play("shot");
    applyShot("p1", index);
    nextTurn();
    rerender();
  };

  const useSmoke = () => {
    if (s.turn !== "p1" || s.p1.cooldowns.smoke > 0) return;
    useAbility("p1", "smoke", 0);
    nextTurn();
    rerender();
  };

  // AI turn
  useEffect(() => {
    if (s.phase !== "battle" || s.turn !== "p2" || s.winner) return;
    const timer = setTimeout(() => {
      const decision = aiDecide(difficulty, size, terrain, s.p2, s.p1);
      if (decision.type === "ability" && decision.ability) {
        useAbility("p2", decision.ability, decision.index);
      } else {
        audio.play("shot");
        applyShot("p2", decision.index);
      }
      nextTurn();
      rerender();
    }, 750);
    return () => clearTimeout(timer);
  }, [s.turn, s.phase, s.turnCount, difficulty, size, terrain]); // eslint-disable-line react-hooks/exhaustive-deps

  const diffName = DIFFICULTIES.find((d) => d.key === difficulty)?.name ?? "Normal";
  const mapName = MAPS.find((m) => m.key === map)?.name ?? "Mar Aberto";
  const accuracy = s.shots ? Math.round((s.hits / s.shots) * 100) : 0;

  return (
    <div className={cn("relative min-h-screen", shake && "animate-od-shake")}>
      <img
        src={MAP_IMAGES[map]}
        alt=""
        aria-hidden
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="pointer-events-none fixed inset-0 bg-background/70" />
      <OceanScene weather="clear" intensity="calm" className="pointer-events-none fixed inset-0 h-full w-full opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl px-3 py-4 sm:px-6">
        {/* top bar */}
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl panel-metal px-3 py-2">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" /> Base
              </Link>
            </Button>
            <Badge variant="secondary">{mapName}</Badge>
            <Badge variant="secondary">{size}x{size}</Badge>
            <Badge className="bg-accent text-accent-foreground">{diffName}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                audio.settings.muted = !audio.settings.muted;
                audio.apply();
                setMuted(audio.settings.muted);
              }}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <FullscreenButton />
          </div>
        </header>

        {s.phase === "placing" && (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-xl panel-metal p-3 sm:p-4">
              <Board
                size={size}
                terrain={terrain}
                knowledge={s.p1.incoming}
                ships={s.p1.ships}
                onCell={placeAt}
                mapKey={map}
                label="Posicione sua frota"
              />
            </div>
            <aside className="rounded-xl panel-metal p-4">
              <h2 className="text-lg font-bold">Frota de Elite</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Escolha uma embarcação, defina a orientação e toque no oceano para posicioná-la.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setOrientation((o) => (o === "h" ? "v" : "h"))} className="gap-2">
                  <RotateCw className="h-4 w-4" /> {orientation === "h" ? "Horizontal" : "Vertical"}
                </Button>
                <Button size="sm" variant="secondary" onClick={autoPlace} className="gap-2">
                  <Shuffle className="h-4 w-4" /> Auto
                </Button>
                <Button size="sm" variant="ghost" onClick={clearPlacement}>
                  Limpar
                </Button>
              </div>
              <ul className="mt-4 space-y-2">
                {remainingDefs.map((def, i) => (
                  <li key={`${def.key}-${i}`}>
                    <button
                      onClick={() => setSelectedShipIdx(i)}
                      className={cn(
                        "w-full rounded-lg border border-border px-3 py-2 text-left transition-colors",
                        i === Math.min(selectedShipIdx, remainingDefs.length - 1)
                          ? "border-primary bg-primary/15"
                          : "hover:bg-muted/40",
                      )}
                    >
                      <img
                        src={SHIP_SPRITES[def.key]}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="mb-1 h-8 w-full object-contain object-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{def.name}</span>
                        <span className="flex gap-[2px]">
                          {Array.from({ length: def.size }, (_, k) => (
                            <span key={k} className="h-2.5 w-2.5 rounded-[2px] bg-steel" />
                          ))}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {def.desc} {def.armor > 1 && `• Blindagem ${def.armor}x`}
                      </p>
                    </button>
                  </li>
                ))}
                {!remainingDefs.length && (
                  <li className="rounded-lg border border-primary/50 bg-primary/10 p-3 text-sm">
                    Frota completa. Pronto para zarpar, Comandante.
                  </li>
                )}
              </ul>
              <Button className="mt-4 w-full gap-2" disabled={remainingDefs.length > 0} onClick={startBattle}>
                <Play className="h-4 w-4" /> Iniciar combate
              </Button>
            </aside>
          </div>
        )}

        {s.phase !== "placing" && (
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_300px]">
            <div className="rounded-xl panel-metal p-3">
              <Board
                size={size}
                terrain={terrain}
                knowledge={s.p1.knowledge}
                onCell={playerFire}
                disabled={s.turn !== "p1" || s.phase === "over"}
                boardId="enemy"
                mapKey={map}
                label={ability ? `Alvo para ${ABILITIES.find((a) => a.key === ability)!.name}` : "Oceano inimigo — ataque"}
              />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="font-bold text-primary">{s.shots}</p>
                  <p className="text-muted-foreground">Disparos</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="font-bold text-accent">{accuracy}%</p>
                  <p className="text-muted-foreground">Precisão</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="font-bold text-destructive">{s.sunk}</p>
                  <p className="text-muted-foreground">Afundados</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl panel-metal p-3">
              <Board
                size={size}
                terrain={terrain}
                knowledge={s.p1.incoming}
                ships={s.p1.ships}
                boardId="own"
                mapKey={map}
                label="Sua frota"
              />
              <div className="mt-3 space-y-1">
                {s.p1.ships.map((sh) => {
                  const alive = sh.damage.filter((d) => d < sh.armor).length;
                  return (
                    <div key={sh.id} className="flex items-center gap-2 text-[11px]">
                      <span className={cn("w-32 truncate", sh.sunk && "text-muted-foreground line-through")}>{sh.name}</span>
                      <Progress value={(alive / sh.size) * 100} className="h-1.5 flex-1" />
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="space-y-3">
              <div className="rounded-xl panel-metal p-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Turno</p>
                <p className={cn("text-lg font-bold", s.turn === "p1" ? "text-primary" : "text-destructive")}>
                  {s.phase === "over" ? "Fim de combate" : s.turn === "p1" ? "Suas ordens" : "Inimigo atacando..."}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Seções restantes — você: {remainingSections(s.p1)} • inimigo: {remainingSections(s.p2)}
                </p>
              </div>

              <div className="rounded-xl panel-metal p-3">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Habilidades</p>
                <div className="grid grid-cols-2 gap-2">
                  {ABILITIES.map((a) => {
                    const Icon = ABILITY_ICONS[a.key] ?? Radar;
                    const cd = s.p1.cooldowns[a.key];
                    const active = ability === a.key;
                    return (
                      <button
                        key={a.key}
                        title={`${a.name} — ${a.desc}`}
                        disabled={cd > 0 || s.turn !== "p1" || s.phase === "over"}
                        onClick={() => (a.targeted ? setAbility(active ? null : a.key) : useSmoke())}
                        className={cn(
                          "rounded-lg border border-border p-2 text-left text-[11px] transition-colors disabled:opacity-40",
                          active ? "border-accent bg-accent/20" : "hover:bg-muted/40",
                        )}
                      >
                        <Icon className="mb-1 h-4 w-4 text-primary" />
                        <p className="font-semibold leading-tight">{a.name}</p>
                        <p className="text-muted-foreground">{cd > 0 ? `Recarga ${cd}` : "Pronto"}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto rounded-xl panel-metal p-3">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Rádio de combate</p>
                <ul className="space-y-1 text-[11px]">
                  {s.log.map((l) => (
                    <li
                      key={l.id}
                      className={cn(
                        "rounded px-2 py-1",
                        l.kind === "hit" && "bg-destructive/15 text-destructive-foreground",
                        l.kind === "sunk" && "bg-destructive/30",
                        l.kind === "ability" && "bg-primary/15",
                        l.who === "p2" && "text-muted-foreground",
                      )}
                    >
                      {l.text}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        )}

        {s.phase === "over" && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/85 backdrop-blur">
            <div className="w-[min(92vw,440px)] rounded-2xl panel-metal p-6 text-center animate-od-rise">
              {s.winner === "p1" ? (
                <Trophy className="mx-auto h-12 w-12 text-accent" />
              ) : (
                <Skull className="mx-auto h-12 w-12 text-destructive" />
              )}
              <h2 className="mt-3 text-2xl font-black uppercase tracking-widest">
                {s.winner === "p1" ? "Vitória Naval" : "Frota Perdida"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {s.winner === "p1"
                  ? "O oceano é seu, Comandante."
                  : "Sua esquadra foi ao fundo. Reagrupe e retorne."}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold">{s.shots}</p>
                  <p className="text-muted-foreground">Disparos</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold">{accuracy}%</p>
                  <p className="text-muted-foreground">Precisão</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold">{s.sunk}</p>
                  <p className="text-muted-foreground">Afundados</p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <Button onClick={() => navigate({ to: "/jogar" })}>Nova batalha</Button>
                <Button variant="outline" asChild>
                  <Link to="/perfil">Ver progressão</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/">Voltar à base</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SupportButton />
    </div>
  );
}
