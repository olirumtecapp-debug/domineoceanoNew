import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Anchor, DoorOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/ocean/Logo";
import { OceanScene } from "@/components/ocean/OceanScene";
import { SupportButton } from "@/components/ocean/SupportButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAP_IMAGES } from "@/game/assets";
import { MAPS } from "@/game/fleet";
import { createRoom, joinRoom } from "@/game/online";
import type { MapKey } from "@/game/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/online")({
  head: () => ({
    meta: [
      { title: "Batalha online — Ocean Dominion" },
      {
        name: "description",
        content: "Crie uma sala, compartilhe o código e enfrente outro comandante em tempo real no oceano.",
      },
      { property: "og:title", content: "Batalha online — Ocean Dominion" },
      { property: "og:description", content: "Salas com código para duelos navais em tempo real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnlinePage,
});

function OnlinePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [size, setSize] = useState(10);
  const [map, setMap] = useState<MapKey>("arquipelago");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);

  const handleCreate = async () => {
    setBusy("create");
    try {
      const room = await createRoom({ size, map, name });
      navigate({ to: "/sala/$code", params: { code: room.code } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível criar a sala.");
      setBusy(null);
    }
  };

  const handleJoin = async () => {
    if (code.trim().length < 4) {
      toast.error("Digite o código da sala.");
      return;
    }
    setBusy("join");
    try {
      const room = await joinRoom(code.trim().toUpperCase(), name);
      navigate({ to: "/sala/$code", params: { code: room.code } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível entrar na sala.");
      setBusy(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <OceanScene weather="storm" intensity="rough" className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-background/60" />
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

        <h1 className="text-3xl font-black uppercase tracking-tight">Batalha online</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie uma sala e envie o código para o seu adversário, ou entre com o código que recebeu.
        </p>

        <section className="mt-6 rounded-xl panel-metal p-4">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Seu nome de guerra</label>
          <Input
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            placeholder="Comandante"
            className="mt-2"
          />
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="rounded-xl panel-metal p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Anchor className="h-5 w-5 text-primary" /> Criar sala
            </h2>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Tamanho do oceano</p>
            <div className="mt-2 flex gap-2">
              {[8, 10, 12].map((n) => (
                <button
                  key={n}
                  onClick={() => setSize(n)}
                  className={cn(
                    "flex-1 rounded-lg border border-border py-2 text-sm font-semibold transition-colors",
                    size === n ? "border-primary bg-primary/20" : "hover:bg-muted/40",
                  )}
                >
                  {n}x{n}
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Cenário</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {MAPS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMap(m.key as MapKey)}
                  className={cn(
                    "overflow-hidden rounded-lg border border-border text-left transition-all",
                    map === m.key ? "border-primary ring-1 ring-primary" : "hover:opacity-90",
                  )}
                >
                  <img src={MAP_IMAGES[m.key as MapKey]} alt="" aria-hidden loading="lazy" className="h-12 w-full object-cover" />
                  <span className="block truncate px-1.5 py-1 text-[10px] font-semibold">{m.name}</span>
                </button>
              ))}
            </div>

            <Button className="mt-4 w-full gap-2" onClick={handleCreate} disabled={busy !== null}>
              {busy === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Anchor className="h-4 w-4" />}
              Criar sala e gerar código
            </Button>
          </section>

          <section className="rounded-xl panel-metal p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <DoorOpen className="h-5 w-5 text-accent" /> Entrar em uma sala
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Peça o código de 5 caracteres ao comandante que criou a batalha.
            </p>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={5}
              placeholder="XXXXX"
              className="mt-4 text-center font-mono text-2xl tracking-[0.4em] uppercase"
            />
            <Button variant="secondary" className="mt-4 w-full gap-2" onClick={handleJoin} disabled={busy !== null}>
              {busy === "join" ? <Loader2 className="h-4 w-4 animate-spin" /> : <DoorOpen className="h-4 w-4" />}
              Entrar na batalha
            </Button>
          </section>
        </div>
      </div>
      <SupportButton />
    </div>
  );
}
