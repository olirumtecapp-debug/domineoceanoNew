import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Anchor, Bot, Users, BookOpen, User, Waves } from "lucide-react";

import { Logo } from "@/components/ocean/Logo";
import { OceanScene } from "@/components/ocean/OceanScene";
import { FullscreenButton, InstallButton } from "@/components/ocean/DeviceButtons";
import { SupportButton } from "@/components/ocean/SupportButton";
import { Button } from "@/components/ui/button";
import { audio } from "@/lib/audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ocean Dominion — Estratégia Naval por Turnos" },
      {
        name: "description",
        content:
          "Comande uma frota de elite em batalhas navais por turnos contra IA em 6 níveis. Radar, sonar, mísseis guiados e combate cinematográfico no celular ou no PC.",
      },
      { property: "og:title", content: "Ocean Dominion — Estratégia Naval por Turnos" },
      {
        property: "og:description",
        content: "Guerra naval moderna: monte sua frota, use habilidades táticas e domine o oceano.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    audio.load();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <OceanScene weather="clear" className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Logo />
          <div className="flex flex-wrap items-center gap-2">
            <InstallButton />
            <FullscreenButton />
            <SupportButton variant="inline" />
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10">
          <div className="max-w-2xl animate-od-rise">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <Waves className="h-3.5 w-3.5 text-primary" /> Guerra naval moderna
            </p>
            <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl">
              Domine o <span className="text-gradient-gold">Oceano</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              As maiores potências marítimas disputam o controle dos mares. Assuma o comando de uma frota
              de elite, leia o inimigo, use radar, sonar e mísseis guiados — e afunde tudo que cruzar seu caminho.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 glow-primary">
                <Link to="/jogar" search={{ mode: "ai" }}>
                  <Bot className="h-5 w-5" /> Jogar contra a IA
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link to="/jogar" search={{ mode: "local" }}>
                  <Users className="h-5 w-5" /> Duelo 1x1 no mesmo aparelho
                </Link>
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/como-jogar">
                  <BookOpen className="h-4 w-4" /> Como jogar
                </Link>
              </Button>
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/perfil">
                  <User className="h-4 w-4" /> Perfil e progressão
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[
              { t: "6 níveis de IA", d: "Do recruta ao Almirante Supremo — nunca atira ao acaso quando tem informação." },
              { t: "Habilidades táticas", d: "Radar, sonar, míssil guiado, ataque aéreo, drone e cortina de fumaça." },
              { t: "Mapas e frotas", d: "Tabuleiros 8x8 a 12x12, ilhas, faróis, plataformas e 7 classes de navio." },
            ].map((c) => (
              <div key={c.t} className="rounded-xl panel-metal p-4">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <Anchor className="h-4 w-4 text-accent" /> {c.t}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="rounded-xl panel-metal p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">
            Jogue no smartphone, tablet, notebook ou PC — e instale como aplicativo.
          </p>
          <p className="mt-1">
            No celular use &quot;Adicionar à tela de início&quot;; no computador, abra o endereço do jogo no Chrome ou Edge e
            clique em instalar. Veja o passo a passo em <Link to="/como-jogar" className="text-primary underline">Como jogar</Link>.
          </p>
        </footer>
      </div>
      <SupportButton />
    </div>
  );
}
