import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Swords } from "lucide-react";

import { Logo } from "@/components/ocean/Logo";
import { OceanScene } from "@/components/ocean/OceanScene";
import { SupportButton } from "@/components/ocean/SupportButton";
import { Button } from "@/components/ui/button";
import { MAP_IMAGES } from "@/game/assets";
import { DIFFICULTIES, MAPS, fleetForSize } from "@/game/fleet";
import type { Difficulty, MapKey } from "@/game/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jogar")({
  head: () => ({
    meta: [
      { title: "Preparar batalha — Ocean Dominion" },
      {
        name: "description",
        content: "Escolha o tamanho do oceano, o mapa e o nível do adversário antes de zarpar para o combate naval.",
      },
      { property: "og:title", content: "Preparar batalha — Ocean Dominion" },
      { property: "og:description", content: "Configure tabuleiro, mapa e dificuldade da sua próxima batalha naval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const [size, setSize] = useState(10);
  const [map, setMap] = useState<MapKey>("arquipelago");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  const start = () =>
    navigate({ to: "/partida", search: { size, map, difficulty } });

  return (
    <div className="relative min-h-screen">
      <OceanScene weather="sunset" intensity="calm" className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-background/50" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <Link to="/">
            <Logo compact />
          </Link>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" /> Base
            </Link>
          </Button>
        </header>

        <h1 className="text-3xl font-black uppercase tracking-tight">Preparar batalha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Combate contra a Inteligência Artificial em seis níveis de dificuldade.
        </p>

        <section className="mt-6 rounded-xl panel-metal p-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tamanho do oceano</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[8, 10, 12].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-lg border border-border p-3 text-center transition-colors",
                  size === s ? "border-primary bg-primary/15" : "hover:bg-muted/40",
                )}
              >
                <p className="text-lg font-bold">{s}x{s}</p>
                <p className="text-[11px] text-muted-foreground">{fleetForSize(s).length} embarcações</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Campo de batalha</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {MAPS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMap(m.key)}
                className={cn(
                  "overflow-hidden rounded-lg border border-border text-left transition-colors",
                  map === m.key ? "border-primary bg-primary/15" : "hover:bg-muted/40",
                )}
              >
                <img
                  src={MAP_IMAGES[m.key]}
                  alt={m.name}
                  loading="lazy"
                  className={cn("h-20 w-full object-cover transition-opacity", map === m.key ? "opacity-100" : "opacity-70")}
                />
                <span className="block p-3">
                  <span className="block text-sm font-semibold">{m.name}</span>
                  <span className="block text-[11px] text-muted-foreground">{m.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {true && (
          <section className="mt-4 rounded-xl panel-metal p-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Nível do adversário</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key as Difficulty)}
                  className={cn(
                    "rounded-lg border border-border p-3 text-left transition-colors",
                    difficulty === d.key ? "border-accent bg-accent/20" : "hover:bg-muted/40",
                  )}
                >
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">{d.desc}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        <Button size="lg" className="mt-6 w-full gap-2 glow-primary" onClick={start}>
          <Swords className="h-5 w-5" /> Zarpar para o combate
        </Button>
      </div>
      <SupportButton />
    </div>
  );
}
