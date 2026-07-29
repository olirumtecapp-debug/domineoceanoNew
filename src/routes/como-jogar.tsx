import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Smartphone, Monitor, Target, Radar, Ship, Trophy, Waves, Flame } from "lucide-react";

import { Logo } from "@/components/ocean/Logo";
import { FullscreenButton, InstallButton } from "@/components/ocean/DeviceButtons";
import { SupportButton } from "@/components/ocean/SupportButton";
import { Button } from "@/components/ui/button";
import { MAP_IMAGES, SHIP_SPRITES } from "@/game/assets";
import { ABILITIES, MAPS, SHIP_DEFS } from "@/game/fleet";

export const Route = createFileRoute("/como-jogar")({
  head: () => ({
    meta: [
      { title: "Como jogar — Ocean Dominion" },
      {
        name: "description",
        content:
          "Regras, frota, habilidades especiais e como instalar o Ocean Dominion no celular, tablet, notebook ou PC.",
      },
      { property: "og:title", content: "Como jogar — Ocean Dominion" },
      { property: "og:description", content: "Aprenda as regras do combate naval e instale o jogo em qualquer dispositivo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowToPlay,
});

function HowToPlay() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/">
            <Logo compact />
          </Link>
          <div className="flex gap-2">
            <InstallButton />
            <FullscreenButton />
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" /> Base
              </Link>
            </Button>
          </div>
        </header>

        <h1 className="text-3xl font-black uppercase tracking-tight">Como jogar</h1>

        <section className="mt-6 rounded-xl panel-metal p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Target className="h-5 w-5 text-primary" /> Objetivo
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vence quem afundar toda a frota inimiga. O combate é por turnos: você dispara em uma célula do oceano
            inimigo, descobre se acertou e passa o comando. Ilhas, rochas e faróis bloqueiam disparos, mas nunca
            impedem a vitória.
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Escolha tamanho do oceano, mapa e nível do adversário.</li>
            <li>Posicione sua frota (ou use o posicionamento automático).</li>
            <li>Ataque célula a célula e use habilidades para revelar posições.</li>
            <li>Afunde toda a esquadra inimiga antes que ela afunde a sua.</li>
          </ol>
        </section>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Ship className="h-5 w-5 text-accent" /> A frota
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {SHIP_DEFS.map((s) => (
              <li key={s.key} className="overflow-hidden rounded-lg border border-border">
                <div className="relative flex h-24 items-center justify-center bg-[oklch(0.22_0.05_240)] p-2">
                  <img
                    src={SHIP_SPRITES[s.key]}
                    alt={s.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                  />
                  <span className="absolute right-2 top-2 flex gap-[2px]">
                    {Array.from({ length: s.size }, (_, k) => (
                      <span key={k} className="h-2 w-2 rounded-[2px] bg-primary/80" />
                    ))}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">
                    {s.name} <span className="text-muted-foreground">• {s.size} seções</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {s.desc}
                    {s.armor > 1 && ` Blindagem ${s.armor}x.`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Waves className="h-5 w-5 text-primary" /> Cenários de batalha
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {MAPS.map((m) => (
              <li key={m.key} className="overflow-hidden rounded-lg border border-border">
                <img
                  src={MAP_IMAGES[m.key]}
                  alt={m.name}
                  loading="lazy"
                  className="h-24 w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{m.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Flame className="h-5 w-5 text-destructive" /> Leitura do combate
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-[12px] text-muted-foreground">
            <li className="rounded-lg border border-border p-3">
              <span className="font-semibold text-foreground">💥 Explosão + fogo</span> — impacto confirmado no casco
              inimigo. A célula fica vermelha.
            </li>
            <li className="rounded-lg border border-border p-3">
              <span className="font-semibold text-foreground">💧 Respingo azul</span> — tiro na água. A célula escurece
              e não pode ser atacada de novo.
            </li>
            <li className="rounded-lg border border-border p-3">
              <span className="font-semibold text-foreground">☠ Detonação em cadeia</span> — navio afundado: toda a
              silhueta explode seção por seção e a tela treme.
            </li>
            <li className="rounded-lg border border-border p-3">
              <span className="font-semibold text-foreground">◎ Pulso ciano</span> — varredura de radar, sonar ou drone
              revelando o setor.
            </li>
          </ul>
        </section>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Radar className="h-5 w-5 text-primary" /> Habilidades especiais
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {ABILITIES.map((a) => (
              <li key={a.key} className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold">
                  {a.name} <span className="text-muted-foreground">• recarga {a.cooldown} turnos</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{a.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Smartphone className="h-5 w-5 text-accent" /> Instalar no celular ou tablet
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              <strong>Android (Chrome, Edge ou Brave):</strong> toque em &quot;Instalar app&quot; nesta página; se não
              aparecer, use o menu ⋮ → &quot;Instalar aplicativo&quot;.
            </li>
            <li>
              <strong>iPhone / iPad (Safari):</strong> toque em Compartilhar ⬆ → &quot;Adicionar à Tela de Início&quot;.
              O jogo abrirá como um app.
            </li>
          </ul>
        </section>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Monitor className="h-5 w-5 text-primary" /> Instalar no computador ou notebook
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No Chrome, Edge ou Brave, clique em &quot;Instalar app&quot; abaixo ou no ícone de instalar da barra de
            endereço. O jogo passa a abrir em janela própria, como um programa. Use &quot;Tela cheia&quot; para uma
            experiência imersiva — clique novamente para desativar.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <InstallButton size="default" />
            <FullscreenButton size="default" />
          </div>
        </section>


        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Trophy className="h-5 w-5 text-accent" /> Progressão
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cada batalha rende XP conforme vitória, precisão e navios afundados. Suba de nível, desbloqueie conquistas
            e acompanhe tudo na página de <Link to="/perfil" className="text-primary underline">Perfil</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
