import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, Trophy, Target, Ship, Award } from "lucide-react";

import { Logo } from "@/components/ocean/Logo";
import { SupportButton } from "@/components/ocean/SupportButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ACHIEVEMENTS, levelFromXp, loadProfile, type Profile } from "@/lib/profile";
import { DIFFICULTIES } from "@/game/fleet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil do Comandante — Ocean Dominion" },
      { name: "description", content: "Acompanhe nível, XP, precisão, conquistas e histórico das suas batalhas navais." },
      { property: "og:title", content: "Perfil do Comandante — Ocean Dominion" },
      { property: "og:description", content: "Estatísticas, conquistas e histórico de confrontos da sua frota." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const stats = profile?.stats;
  const lvl = levelFromXp(stats?.xp ?? 0);
  const accuracy = stats?.shots ? Math.round((stats.hits / stats.shots) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
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

        <div className="rounded-xl panel-metal p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Comandante</p>
              <h1 className="text-2xl font-black uppercase tracking-tight">Nível {lvl.level}</h1>
            </div>
            <Badge className="bg-accent text-accent-foreground">{stats?.xp ?? 0} XP</Badge>
          </div>
          <Progress value={lvl.progress} className="mt-4 h-2" />
          <p className="mt-1 text-[11px] text-muted-foreground">
            {Math.max(0, lvl.next - (stats?.xp ?? 0))} XP para o próximo nível
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Trophy, label: "Vitórias", value: stats?.wins ?? 0 },
            { icon: Ship, label: "Afundados", value: stats?.sunk ?? 0 },
            { icon: Target, label: "Precisão", value: `${accuracy}%` },
            { icon: Award, label: "Partidas", value: stats?.played ?? 0 },
          ].map((c) => (
            <div key={c.label} className="rounded-xl panel-metal p-4 text-center">
              <c.icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-xl font-bold">{c.value}</p>
              <p className="text-[11px] text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Conquistas</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = profile?.achievements.includes(a.key);
              return (
                <li
                  key={a.key}
                  className={cn(
                    "rounded-lg border p-3",
                    unlocked ? "border-accent bg-accent/10" : "border-border opacity-60",
                  )}
                >
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-4 rounded-xl panel-metal p-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Histórico de confrontos</h2>
          {!profile?.history.length ? (
            <p className="mt-3 text-sm text-muted-foreground">Nenhuma batalha registrada ainda.</p>
          ) : (
            <ul className="mt-3 space-y-1 text-xs">
              {profile.history.map((h, i) => (
                <li key={i} className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                  <span className={cn("font-semibold", h.result === "win" ? "text-primary" : "text-destructive")}>
                    {h.result === "win" ? "Vitória" : "Derrota"}
                  </span>
                  <span className="text-muted-foreground">
                    {DIFFICULTIES.find((d) => d.key === h.difficulty)?.name ?? h.difficulty} • {h.size}x{h.size} • {h.accuracy}%
                  </span>
                  <span className="text-muted-foreground">{new Date(h.date).toLocaleDateString("pt-BR")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Button asChild size="lg" className="mt-6 w-full">
          <Link to="/jogar" search={{ mode: "ai" }}>Nova batalha</Link>
        </Button>
      </div>
      <SupportButton />
    </div>
  );
}
