import { ShieldCheck, Swords, TrendingDown } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { advantage, remainingSections, shipsAlive, totalSections } from "@/game/engine";
import type { PlayerState } from "@/game/types";
import { cn } from "@/lib/utils";

interface Props {
  me: PlayerState;
  foe: PlayerState;
  myName?: string;
  foeName?: string;
  turnNumber: number;
  statusText: string;
  myTurn: boolean;
  over?: boolean;
}

const STATE = {
  winning: {
    label: "Vencendo",
    tone: "text-emerald-400 border-emerald-400/60 bg-emerald-400/10",
    Icon: ShieldCheck,
  },
  even: { label: "Equilibrado", tone: "text-gold border-gold/60 bg-gold/10", Icon: Swords },
  losing: { label: "Perdendo", tone: "text-destructive border-destructive/60 bg-destructive/10", Icon: TrendingDown },
} as const;

export function AdvantagePanel({ me, foe, myName = "Sua frota", foeName = "Frota inimiga", turnNumber, statusText, myTurn, over }: Props) {
  const adv = advantage(me, foe);
  const conf = STATE[adv];
  const Icon = conf.Icon;
  const myAlive = remainingSections(me);
  const foeAlive = remainingSections(foe);

  return (
    <div className="rounded-xl panel-metal p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Turno {turnNumber}</p>
        {!over && (
          <span className={cn("h-2.5 w-2.5 animate-pulse rounded-full", myTurn ? "bg-primary" : "bg-destructive")} />
        )}
      </div>
      <p className={cn("text-lg font-bold", over ? "text-foreground" : myTurn ? "text-primary" : "text-destructive")}>
        {statusText}
      </p>

      {!over && (
        <div className={cn("mt-2 flex items-center gap-2 rounded-lg border px-3 py-2", conf.tone)}>
          <Icon className="h-5 w-5" />
          <div className="leading-tight">
            <p className="text-sm font-black uppercase tracking-widest">{conf.label}</p>
            <p className="text-[10px] opacity-80">
              {shipsAlive(me)} × {shipsAlive(foe)} navios • {myAlive} × {foeAlive} seções
            </p>
          </div>
        </div>
      )}

      <div className="mt-3 space-y-2">
        <div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>{myName}</span>
            <span>
              {myAlive}/{totalSections(me)}
            </span>
          </div>
          <Progress value={(myAlive / Math.max(1, totalSections(me))) * 100} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>{foeName}</span>
            <span>
              {foeAlive}/{totalSections(foe)}
            </span>
          </div>
          <Progress value={(foeAlive / Math.max(1, totalSections(foe))) * 100} className="h-2" />
        </div>
      </div>
    </div>
  );
}
