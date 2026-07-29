import { memo } from "react";

import { FxCanvas } from "@/components/game/FxCanvas";
import { SHIP_SPRITES, MAP_IMAGES } from "@/game/assets";
import { coordLabel, xy } from "@/game/engine";
import type { CellKnowledge, MapKey, Ship, Terrain } from "@/game/types";
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
  boardId?: string;
  mapKey?: MapKey;
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
  boardId,
  mapKey,
}: Props) {
  const shipCellMap = new Map<number, { ship: Ship; pos: number }>();
  ships?.forEach((s) => s.cells.forEach((c, pos) => shipCellMap.set(c, { ship: s, pos })));
  const pct = 100 / size;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-border p-1.5 sm:p-2">
        {mapKey && (
          <img
            src={MAP_IMAGES[mapKey]}
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 saturate-75"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, oklch(0.32 0.07 232 / 0.72), oklch(0.14 0.05 248 / 0.92))",
          }}
        />
        <div className="relative">
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
                    "bg-[oklch(0.30_0.06_230_/_0.45)]",
                    (x + y) % 2 === 0 && "bg-[oklch(0.34_0.06_228_/_0.45)]",
                    t !== "water" && "bg-[oklch(0.35_0.03_120_/_0.75)]",
                    !disabled &&
                      !k.shot &&
                      t === "water" &&
                      onCell &&
                      "cursor-crosshair hover:bg-primary/40 hover:ring-1 hover:ring-primary",
                    missHere && "bg-[oklch(0.24_0.04_240_/_0.85)]",
                    hitHere && "bg-destructive/70",
                    sunkShip && "bg-destructive/85",
                    k.revealedShip && !k.shot && "ring-1 ring-gold",
                    highlight.includes(i) && "ring-2 ring-accent",
                    compact ? "text-[7px]" : "text-[9px] sm:text-[11px]",
                  )}
                >
                  {t !== "water" && <span className="leading-none">{TERRAIN_ICON[t]}</span>}
                  {missHere && (
                    <span className="absolute inset-0 flex items-center justify-center text-primary/70">•</span>
                  )}
                  {hitHere && (
                    <span className="absolute inset-0 z-20 flex items-center justify-center text-[10px] animate-od-rise">
                      {sunkShip ? "☠" : "🔥"}
                    </span>
                  )}
                  {k.revealed && !k.shot && !k.revealedShip && (
                    <span className="absolute inset-0 flex items-center justify-center text-primary/50">·</span>
                  )}
                  {k.revealedShip && !k.shot && (
                    <span className="absolute inset-0 flex items-center justify-center text-gold">◎</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ship sprites (own board only) */}
          {ships && (
            <div className="pointer-events-none absolute inset-0 z-10">
              {ships.map((s) => {
                const first = xy(size, s.cells[0]);
                const vertical = s.cells.length > 1 && s.cells[1] - s.cells[0] === size;
                const w = vertical ? 1 : s.cells.length;
                const h = vertical ? s.cells.length : 1;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "absolute flex items-center justify-center transition-opacity",
                      s.sunk ? "opacity-40 grayscale" : "opacity-95",
                    )}
                    style={{
                      left: `${first.x * pct}%`,
                      top: `${first.y * pct}%`,
                      width: `${w * pct}%`,
                      height: `${h * pct}%`,
                    }}
                  >
                    <img
                      src={SHIP_SPRITES[s.key]}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="max-h-none object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                      style={
                        vertical
                          ? { width: `${(h / w) * 100}%`, height: `${(w / h) * 100}%`, transform: "rotate(90deg)" }
                          : { width: "100%", height: "100%" }
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}

          {boardId && (
            <FxCanvas boardId={boardId} size={size} className="pointer-events-none absolute inset-0 z-30 h-full w-full" />
          )}
        </div>
      </div>
    </div>
  );
});
