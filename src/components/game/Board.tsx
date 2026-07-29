import { memo } from "react";

import { coordLabel, xy } from "@/game/engine";
import type { CellKnowledge, Ship, Terrain } from "@/game/types";
import { cn } from "@/lib/utils";

interface Props {
  size: number;
  terrain: Terrain[];
  knowledge: CellKnowledge[];
  ships?: Ship[]; // shown only on own board
  onCell?: (i: number) => void;
  disabled?: boolean;
  highlight?: number[];
  label: string;
  compact?: boolean;
}

const TERRAIN_ICON: Record<Terrain, string> = {
  water: "",
  island: "🏝️",
  rock: "🪨",
  lighthouse: "🗼",
  buoy: "🛟",
  rig: "🛢️",
};

export const Board = memo(function Board({
  size,
  terrain,
  knowledge,
  ships,
  onCell,
  disabled,
  highlight = [],
  label,
  compact,
}: Props) {
  const shipCellMap = new Map<number, { ship: Ship; pos: number }>();
  ships?.forEach((s) => s.cells.forEach((c, pos) => shipCellMap.set(c, { ship: s, pos })));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <div
        className="relative overflow-hidden rounded-xl border border-border p-1.5 sm:p-2"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, oklch(0.32 0.07 232 / 0.9), oklch(0.16 0.05 248 / 0.95))",
        }}
      >
        <div
          className="grid gap-[2px] sm:gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: size * size }, (_, i) => {
            const k = knowledge[i];
            const t = terrain[i];
            const own = shipCellMap.get(i);
            const hitHere = k.shot && (k.result === "hit" || k.result === "sunk");
            const missHere = k.shot && k.result === "miss";
            const sunkShip = own?.ship.sunk;
            const { x, y } = xy(size, i);
            return (
              <button
                key={i}
                type="button"
                disabled={disabled || k.shot || t !== "water"}
                onClick={() => onCell?.(i)}
                aria-label={`Célula ${coordLabel(size, i)}`}
                className={cn(
                  "group relative aspect-square rounded-[3px] transition-all duration-150",
                  "bg-[oklch(0.30_0.06_230_/_0.55)]",
                  (x + y) % 2 === 0 && "bg-[oklch(0.33_0.06_228_/_0.55)]",
                  t !== "water" && "bg-[oklch(0.35_0.03_120_/_0.75)]",
                  !disabled && !k.shot && t === "water" && onCell && "hover:bg-primary/40 hover:ring-1 hover:ring-primary cursor-crosshair",
                  missHere && "bg-[oklch(0.24_0.04_240_/_0.9)]",
                  hitHere && "bg-destructive/70",
                  sunkShip && "bg-destructive/90",
                  own && !hitHere && "bg-[oklch(0.55_0.03_235)]",
                  k.revealedShip && !k.shot && "ring-1 ring-gold",
                  highlight.includes(i) && "ring-2 ring-accent",
                  compact ? "text-[7px]" : "text-[9px] sm:text-[11px]",
                )}
              >
                {t !== "water" && <span className="leading-none">{TERRAIN_ICON[t]}</span>}
                {missHere && <span className="absolute inset-0 flex items-center justify-center text-primary/70">•</span>}
                {hitHere && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] animate-od-rise">
                    {sunkShip ? "☠" : "🔥"}
                  </span>
                )}
                {k.revealed && !k.shot && !k.revealedShip && (
                  <span className="absolute inset-0 flex items-center justify-center text-primary/50">·</span>
                )}
                {k.revealedShip && !k.shot && (
                  <span className="absolute inset-0 flex items-center justify-center text-gold">◎</span>
                )}
                {own && !hitHere && (
                  <span className="absolute inset-0 rounded-[3px] border border-foreground/20" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
