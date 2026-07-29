import { memo, useState } from "react";
import { Trees, Mountain, TowerControl, LifeBuoy, Factory } from "lucide-react";

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

const TERRAIN_ICON: Partial<Record<Terrain, typeof Trees>> = {
  island: Trees,
  rock: Mountain,
  lighthouse: TowerControl,
  buoy: LifeBuoy,
  rig: Factory,
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
  const [hover, setHover] = useState<number | null>(null);
  const shipCellMap = new Map<number, { ship: Ship; pos: number }>();
  ships?.forEach((s) => s.cells.forEach((c, pos) => shipCellMap.set(c, { ship: s, pos })));
  const pct = 100 / size;


  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        {onCell && !disabled && (
          <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
            {hover !== null ? `ALVO ${coordLabel(size, hover)}` : "ALVO --"}
          </span>
        )}
      </div>
      <div className="relative overflow-hidden rounded-xl border border-border p-1.5 sm:p-2">
        {mapKey && (
          <img
            src={MAP_IMAGES[mapKey]}
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.18 0.05 245 / 0.12) 30%, oklch(0.12 0.04 248 / 0.72) 100%)",
          }}
        />

        <div className="relative flex gap-1">
          {/* numbers ruler */}
          <div
            className="grid w-3 shrink-0 gap-[2px] text-[8px] sm:w-4 sm:gap-[3px] sm:text-[10px]"
            style={{ gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`, marginTop: "calc(0.85rem + 2px)" }}
            aria-hidden
          >
            {Array.from({ length: size }, (_, r) => (
              <span
                key={r}
                className={cn(
                  "flex items-center justify-center font-mono font-bold leading-none",
                  hover !== null && xy(size, hover).y === r ? "text-accent" : "text-primary/60",
                )}
              >
                {r + 1}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            {/* letters ruler */}
            <div
              className="mb-[2px] grid h-[0.85rem] gap-[2px] text-[8px] sm:gap-[3px] sm:text-[10px]"
              style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
              aria-hidden
            >
              {Array.from({ length: size }, (_, c) => (
                <span
                  key={c}
                  className={cn(
                    "flex items-center justify-center font-mono font-bold leading-none",
                    hover !== null && xy(size, hover).x === c ? "text-accent" : "text-primary/60",
                  )}
                >
                  {String.fromCharCode(65 + c)}
                </span>
              ))}
            </div>

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
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                  onFocus={() => setHover(i)}
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
                  {t !== "water" &&
                    (() => {
                      const Icon = TERRAIN_ICON[t];
                      return Icon ? (
                        <Icon className="absolute inset-0 m-auto h-1/2 w-1/2 text-[oklch(0.78_0.09_115)]" />
                      ) : null;
                    })()}
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
                      className="max-h-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)]"
                      style={
                        vertical
                          ? {
                              width: `${(h / w) * 100}%`,
                              height: `${(w / h) * 100}%`,
                              objectFit: "fill",
                              transform: "rotate(90deg)",
                            }
                          : { width: "100%", height: "100%", objectFit: "fill" }
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
      </div>
    </div>
  );
});

