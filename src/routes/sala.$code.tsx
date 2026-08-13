import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Home,
  Copy,
  Play,
  RotateCw,
  Shuffle,
  Loader2,
  Trophy,
  Skull,
  Volume2,
  VolumeX,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AdvantagePanel } from "@/components/game/AdvantagePanel";
import { Board } from "@/components/game/Board";
import { OceanScene } from "@/components/ocean/OceanScene";
import { FullscreenButton } from "@/components/ocean/DeviceButtons";
import { GameLink } from "@/components/ocean/GameLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { MAP_IMAGES, SHIP_SPRITES } from "@/game/assets";
import {
  allSunk,
  autoPlaceFleet,
  cellOpen,
  canPlace,
  coordLabel,
  createPlayer,
  makeShip,
  remainingSections,
  resolveShot,
  shipCells,
} from "@/game/engine";
import { MAPS, fleetForSize } from "@/game/fleet";
import { fx } from "@/game/fx";
import {
  fetchMoves,
  fetchRoom,
  finishRoom,
  joinRoom,
  recallSide,
  sendMove,
  submitFleet,
  type MoveRow,
  type RoomRow,
  type Side,
} from "@/game/online";
import type { MapKey, Orientation, Ship } from "@/game/types";
import { audio } from "@/lib/audio";
import { recordMatch } from "@/lib/profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sala/$code")({
  head: () => ({
    meta: [
      { title: "Sala de batalha — Ocean Dominion" },
      { name: "description", content: "Duelo naval em tempo real contra outro comandante." },
      { property: "og:title", content: "Sala de batalha — Ocean Dominion" },
      { property: "og:description", content: "Entre com o código da sala e enfrente outro comandante." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoomPage,
});

interface Replay {
  me: ReturnType<typeof createPlayer>;
  foe: ReturnType<typeof createPlayer>;
  dealt: number;
  taken: number;
  shots: number;
  hits: number;
  sunkByMe: number;
  lostByMe: number;
}

function RoomPage() {
  const { code } = Route.useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<RoomRow | null>(null);
  const [moves, setMoves] = useState<MoveRow[]>([]);
  const [side, setSide] = useState<Side | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinName, setJoinName] = useState("");
  const [ships, setShips] = useState<Ship[]>([]);
  const [selectedShipIdx, setSelectedShipIdx] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>("h");
  const [muted, setMuted] = useState(false);
  const [shake, setShake] = useState(false);
  const seen = useRef(0);
  const recorded = useRef(false);

  useEffect(() => {
    audio.load();
    setMuted(audio.settings.muted);
    return () => audio.stopMusic();
  }, []);

  const refresh = useCallback(async () => {
    const r = await fetchRoom(code);
    if (!r) {
      setLoading(false);
      return;
    }
    setRoom(r);
    setMoves(await fetchMoves(r.id));
    setSide(recallSide(code));
    setLoading(false);
  }, [code]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // realtime
  useEffect(() => {
    if (!room) return;
    const channel = supabase
      .channel(`room-${room.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${room.id}` }, (p) => {
        setRoom(p.new as unknown as RoomRow);
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "room_moves", filter: `room_id=eq.${room.id}` },
        (p) => {
          setMoves((prev) => {
            const row = p.new as unknown as MoveRow;
            return prev.some((m) => m.id === row.id) ? prev : [...prev, row];
          });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const size = room?.size ?? 10;
  const fleet = useMemo(() => fleetForSize(size), [size]);

  const myShips = side === "host" ? room?.host_ships : room?.guest_ships;
  const foeShips = side === "host" ? room?.guest_ships : room?.host_ships;
  const myName = side === "host" ? room?.host_name : room?.guest_name;
  const foeName = side === "host" ? room?.guest_name : room?.host_name;
  const foeSide: Side = side === "host" ? "guest" : "host";

  // ---------- replay ----------
  const replay: Replay | null = useMemo(() => {
    if (!room || !side || !myShips || !foeShips) return null;
    const me = createPlayer(myName ?? "Você", size, JSON.parse(JSON.stringify(myShips)) as Ship[]);
    const foe = createPlayer(foeName ?? "Adversário", size, JSON.parse(JSON.stringify(foeShips)) as Ship[]);
    let dealt = 0;
    let taken = 0;
    let shots = 0;
    let hits = 0;
    let sunkByMe = 0;
    let lostByMe = 0;
    for (const mv of moves) {
      const mine = mv.by === side;
      const atk = mine ? me : foe;
      const def = mine ? foe : me;
      if (atk.knowledge[mv.cell] && !cellOpen(atk.knowledge[mv.cell])) continue;
      const out = resolveShot(def, room.terrain, mv.cell);
      atk.knowledge[mv.cell] = { ...atk.knowledge[mv.cell], shot: true, result: out.result };
      def.incoming[mv.cell] = { shot: true, result: out.result };
      if (out.ship?.sunk) {
        out.ship.cells.forEach((c) => {
          atk.knowledge[c] = { ...atk.knowledge[c], shot: true, result: "sunk" };
          def.incoming[c] = { shot: true, result: "sunk" };
        });
      }
      if (out.result === "blocked") continue;
      if (mine) {
        shots++;
        if (out.result !== "miss") {
          hits++;
          dealt++;
          if (out.ship?.sunk) sunkByMe++;
        }
      } else if (out.result !== "miss") {
        taken++;
        if (out.ship?.sunk) lostByMe++;
      }
    }
    return { me, foe, dealt, taken, shots, hits, sunkByMe, lostByMe };
  }, [room, side, myShips, foeShips, moves, size, myName, foeName]);

  // effects + audio for new moves
  useEffect(() => {
    if (!replay || !side) return;
    if (seen.current === 0) {
      seen.current = moves.length;
      return;
    }
    const fresh = moves.slice(seen.current);
    seen.current = moves.length;
    fresh.forEach((mv) => {
      const mine = mv.by === side;
      const board = mine ? "enemy" : "own";
      const view = mine ? replay.foe : replay.me;
      const hit = view.incoming[mv.cell]?.result;
      if (hit === "miss") {
        audio.play("miss");
        fx(board, mv.cell, "splash");
      } else if (hit === "sunk") {
        audio.play("sunk");
        fx(board, mv.cell, "sunk");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        const ship = view.ships.find((sh) => sh.cells.includes(mv.cell));
        const left = view.ships.filter((sh) => !sh.sunk).length;
        if (mine) toast.success(`${ship?.name ?? "Navio"} inimigo AFUNDADO! Faltam ${left}.`);
        else toast.error(`Seu ${ship?.name ?? "navio"} foi afundado! Restam ${left}.`);
      } else {
        audio.play("hit");
        fx(board, mv.cell, "explosion");
      }
    });
  }, [moves, replay, side]);

  const battleReady = Boolean(room?.host_ships && room?.guest_ships);
  const turnSide: Side = moves.length % 2 === 0 ? "host" : "guest";
  const myTurn = battleReady && side === turnSide && !room?.winner;

  const winner: Side | null = useMemo(() => {
    if (!replay) return (room?.winner as Side | null) ?? null;
    if (allSunk(replay.foe)) return side;
    if (allSunk(replay.me)) return foeSide;
    return (room?.winner as Side | null) ?? null;
  }, [replay, room?.winner, side, foeSide]);

  useEffect(() => {
    if (!room || !winner || recorded.current || !replay) return;
    recorded.current = true;
    audio.stopMusic();
    audio.play(winner === side ? "victory" : "defeat");
    void finishRoom(room, winner);
    recordMatch({
      win: winner === side,
      shots: replay.shots,
      hits: replay.hits,
      sunk: replay.sunkByMe,
      difficulty: "normal",
      size,
    });
  }, [winner, room, replay, side, size]);

  // ---------- placement helpers ----------
  const remainingDefs = useMemo(() => {
    const counts = new Map<string, number>();
    ships.forEach((sh) => counts.set(sh.key, (counts.get(sh.key) ?? 0) + 1));
    const left: typeof fleet = [];
    const used = new Map<string, number>();
    for (const def of fleet) {
      const u = used.get(def.key) ?? 0;
      if (u < (counts.get(def.key) ?? 0)) used.set(def.key, u + 1);
      else left.push(def);
    }
    return left;
  }, [fleet, ships]);

  const placeAt = (i: number) => {
    if (!room) return;
    const def = remainingDefs[Math.min(selectedShipIdx, remainingDefs.length - 1)];
    if (!def) return;
    const cells = shipCells(size, i, def.size, orientation);
    if (!cells || !canPlace(size, room.terrain, ships, cells)) {
      toast.error("Posição inválida para essa embarcação.");
      return;
    }
    setShips((prev) => [...prev, makeShip(def, cells)]);
    audio.play("click");
    setSelectedShipIdx(0);
  };

  const confirmFleet = async () => {
    if (!room || !side) return;
    if (remainingDefs.length) {
      toast.error("Posicione toda a frota antes de confirmar.");
      return;
    }
    await submitFleet(room, side, ships);
    audio.resume();
    audio.startMusic();
    toast.success("Frota confirmada! Aguardando o adversário.");
    void refresh();
  };

  const fire = async (index: number) => {
    if (!room || !side || !myTurn) return;
    audio.play("shot");
    try {
      await sendMove(room, side, index);
    } catch {
      toast.error("Falha ao enviar o disparo. Verifique sua conexão.");
    }
  };

  const enterRoom = async () => {
    try {
      await joinRoom(code, joinName);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível entrar.");
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code.toUpperCase());
      toast.success("Código copiado!");
    } catch {
      toast.error("Copie manualmente: " + code.toUpperCase());
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-black uppercase">Sala não encontrada</h1>
        <p className="text-sm text-muted-foreground">O código {code.toUpperCase()} não existe ou a batalha expirou.</p>
        <Button onClick={() => navigate({ to: "/online" })}>Voltar ao lobby</Button>
      </div>
    );
  }

  const mapName = MAPS.find((m) => m.key === room.map)?.name ?? "Mar Aberto";

  if (!side) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <OceanScene weather="night" intensity="calm" className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
        <div className="relative z-10 w-[min(92vw,420px)] rounded-2xl panel-metal p-6 text-center">
          <Users className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-3 text-xl font-black uppercase tracking-widest">Sala {code.toUpperCase()}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {room.host_name} está no comando. Informe seu nome para assumir a esquadra rival.
          </p>
          <Input
            value={joinName}
            maxLength={20}
            onChange={(e) => setJoinName(e.target.value)}
            placeholder="Comandante"
            className="mt-4"
          />
          <Button className="mt-4 w-full" onClick={enterRoom}>
            Entrar na batalha
          </Button>
        </div>
      </div>
    );
  }

  const iAmReady = Boolean(myShips);
  const foeReady = Boolean(foeShips);

  return (
    <div className={cn("relative min-h-screen", shake && "animate-od-shake")}>
      <img
        src={MAP_IMAGES[room.map as MapKey]}
        alt=""
        aria-hidden
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="pointer-events-none fixed inset-0 bg-background/35" />

      <div className="relative z-10 mx-auto max-w-7xl px-3 py-4 sm:px-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl panel-metal px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" /> Base
              </Link>
            </Button>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 rounded-md bg-primary/20 px-3 py-1 font-mono text-sm font-bold tracking-[0.3em] text-primary"
            >
              {room.code}
              <Copy className="h-3.5 w-3.5" />
            </button>
            <Badge variant="secondary">Cenário: {mapName}</Badge>
            <Badge variant="secondary">
              {room.size}x{room.size}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <SupportButton />
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

        {/* placement */}
        {!iAmReady && (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-xl panel-metal p-3 sm:p-4">
              <Board
                size={size}
                terrain={room.terrain}
                knowledge={createPlayer("", size, []).incoming}
                ships={ships}
                onCell={placeAt}
                mapKey={room.map as MapKey}
                label="Posicione sua frota"
              />
            </div>
            <aside className="rounded-xl panel-metal p-4">
              <h2 className="text-lg font-bold">Frota de Elite</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {foeName ? `${foeName} entrou na sala.` : "Aguardando o adversário entrar com o código."}
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setOrientation((o) => (o === "h" ? "v" : "h"))} className="gap-2">
                  <RotateCw className="h-4 w-4" /> {orientation === "h" ? "Horizontal" : "Vertical"}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShips(autoPlaceFleet(size, room.terrain))} className="gap-2">
                  <Shuffle className="h-4 w-4" /> Auto
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShips([])}>
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
                      <span className="text-sm font-semibold">{def.name}</span>
                      <p className="text-[11px] text-muted-foreground">{def.desc}</p>
                    </button>
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full gap-2" disabled={remainingDefs.length > 0} onClick={confirmFleet}>
                <Play className="h-4 w-4" /> Confirmar frota
              </Button>
            </aside>
          </div>
        )}

        {/* waiting */}
        {iAmReady && !battleReady && (
          <div className="mx-auto mt-12 w-[min(92vw,460px)] rounded-2xl panel-metal p-8 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h2 className="mt-4 text-xl font-black uppercase tracking-widest">Aguardando o adversário</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {foeName
                ? `${foeName} ainda está posicionando a frota.`
                : "Compartilhe o código da sala para que alguém entre na batalha."}
            </p>
            <button
              onClick={copyCode}
              className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-primary/20 px-5 py-3 font-mono text-2xl font-black tracking-[0.4em] text-primary"
            >
              {room.code}
              <Copy className="h-4 w-4" />
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              Peça para o seu adversário abrir o endereço abaixo no computador ou no celular e digitar o código.
            </p>
            <div className="mt-2 text-left">
              <GameLink compact />
            </div>
          </div>
        )}

        {/* battle */}
        {battleReady && replay && (
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_300px]">
            <div className="rounded-xl panel-metal p-3">
              <Board
                size={size}
                terrain={room.terrain}
                knowledge={replay.me.knowledge}
                onCell={(i) => void fire(i)}
                disabled={!myTurn || Boolean(winner)}
                boardId="enemy"
                mapKey={room.map as MapKey}
                label={`Oceano de ${foeName ?? "adversário"}`}
              />
            </div>

            <div className="rounded-xl panel-metal p-3">
              <Board
                size={size}
                terrain={room.terrain}
                knowledge={replay.me.incoming}
                ships={replay.me.ships}
                boardId="own"
                mapKey={room.map as MapKey}
                label="Sua frota"
              />
              <div className="mt-3 space-y-1">
                {replay.me.ships.map((sh) => {
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
              <AdvantagePanel
                me={replay.me}
                foe={replay.foe}
                myName={myName ?? "Sua frota"}
                foeName={foeName ?? "Frota inimiga"}
                turnNumber={moves.length + 1}
                myTurn={myTurn}
                over={Boolean(winner)}
                statusText={
                  winner
                    ? winner === side
                      ? "Você venceu!"
                      : "Você foi derrotado"
                    : myTurn
                      ? "Suas ordens"
                      : `${foeName ?? "Adversário"} atacando...`
                }
              />

              <div className="rounded-xl panel-metal p-3">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Painel de comando</p>
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="rounded-md bg-muted/40 p-2">
                    <p className="text-base font-bold text-primary">{replay.dealt}</p>
                    <p className="text-muted-foreground">Dano causado</p>
                  </div>
                  <div className="rounded-md bg-muted/40 p-2">
                    <p className="text-base font-bold text-destructive">{replay.taken}</p>
                    <p className="text-muted-foreground">Dano recebido</p>
                  </div>
                  <div className="rounded-md bg-muted/40 p-2">
                    <p className="text-base font-bold text-accent">
                      {replay.shots ? Math.round((replay.hits / replay.shots) * 100) : 0}%
                    </p>
                    <p className="text-muted-foreground">Precisão</p>
                  </div>
                  <div className="rounded-md bg-muted/40 p-2">
                    <p className="text-base font-bold">
                      {replay.sunkByMe}/{replay.lostByMe}
                    </p>
                    <p className="text-muted-foreground">Afundou/Perdeu</p>
                  </div>
                </div>
                <p className="mt-3 mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Últimas ordens</p>
                <ul className="space-y-1 text-[11px]">
                  {[...moves]
                    .slice(-4)
                    .reverse()
                    .map((mv) => {
                      const mine = mv.by === side;
                      const res = (mine ? replay.foe : replay.me).incoming[mv.cell]?.result;
                      return (
                        <li
                          key={mv.id}
                          className={cn(
                            "truncate rounded px-2 py-1",
                            res === "sunk" && "bg-destructive/30 font-semibold",
                            res === "hit" && "bg-destructive/15",
                            !mine && "text-muted-foreground",
                          )}
                        >
                          {mine ? "Você" : (foeName ?? "Inimigo")} → {coordLabel(size, mv.cell)}:{" "}
                          {res === "miss" ? "água" : res === "sunk" ? "AFUNDOU" : "impacto"}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </aside>
          </div>
        )}

        {winner && replay && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/85 backdrop-blur">
            <div className="w-[min(92vw,440px)] rounded-2xl panel-metal p-6 text-center animate-od-rise">
              {winner === side ? (
                <Trophy className="mx-auto h-12 w-12 text-accent" />
              ) : (
                <Skull className="mx-auto h-12 w-12 text-destructive" />
              )}
              <h2 className="mt-3 text-2xl font-black uppercase tracking-widest">
                {winner === side ? "Vitória Naval" : "Frota Perdida"}
              </h2>
              <p className="mx-auto mt-2 w-fit rounded-full border border-gold/60 bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold">
                Vencedor: {winner === side ? myName ?? "Você" : foeName ?? "Adversário"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {winner === side
                  ? `Você dominou ${foeName ?? "o adversário"} nesta batalha.`
                  : `${foeName ?? "O adversário"} levou a melhor desta vez.`}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold">{replay.shots}</p>
                  <p className="text-muted-foreground">Disparos</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold">
                    {replay.shots ? Math.round((replay.hits / replay.shots) * 100) : 0}%
                  </p>
                  <p className="text-muted-foreground">Precisão</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold">{moves.length}</p>
                  <p className="text-muted-foreground">Jogadas</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold text-primary">{replay.dealt}</p>
                  <p className="text-muted-foreground">Dano causado</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold text-destructive">{replay.taken}</p>
                  <p className="text-muted-foreground">Dano recebido</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2">
                  <p className="text-base font-bold">
                    {replay.sunkByMe}/{replay.lostByMe}
                  </p>
                  <p className="text-muted-foreground">Afundou/Perdeu</p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <Button onClick={() => navigate({ to: "/online" })}>Nova sala</Button>
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
    </div>
  );
}
