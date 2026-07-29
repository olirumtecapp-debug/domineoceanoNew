export type Orientation = "h" | "v";

export type ShipKey =
  | "carrier"
  | "battleship"
  | "cruiser"
  | "frigate"
  | "destroyer"
  | "submarine"
  | "patrol";

export interface ShipDef {
  key: ShipKey;
  name: string;
  size: number;
  /** hits needed per cell */
  armor: number;
  desc: string;
}

export interface Ship {
  id: string;
  key: ShipKey;
  name: string;
  size: number;
  armor: number;
  cells: number[]; // board indexes
  damage: number[]; // hits per cell
  sunk: boolean;
}

export type Terrain = "water" | "island" | "rock" | "lighthouse" | "buoy" | "rig";

/** "damaged" = section hit but still afloat (armored ship): can be attacked again. */
export type ShotResult = "miss" | "hit" | "sunk" | "blocked" | "damaged";

export interface CellKnowledge {
  shot: boolean;
  result?: ShotResult;
  revealed?: boolean; // radar/sonar
  revealedShip?: boolean;
}

export interface PlayerState {
  name: string;
  ships: Ship[];
  /** what happened on MY board */
  incoming: CellKnowledge[];
  /** what I know about the ENEMY board */
  knowledge: CellKnowledge[];
  cooldowns: Record<AbilityKey, number>;
  smokeTurns: number;
}

export type AbilityKey =
  | "radar"
  | "sonar"
  | "airstrike"
  | "missile"
  | "smoke"
  | "repair"
  | "drone";

export interface AbilityDef {
  key: AbilityKey;
  name: string;
  desc: string;
  cooldown: number;
  icon: string;
  /** needs a target cell */
  targeted: boolean;
}

export type Difficulty = "muito_facil" | "facil" | "normal" | "dificil" | "especialista" | "almirante";

export type MapKey = "mar_aberto" | "arquipelago" | "vulcanica" | "costa" | "polar" | "tropical";

export interface MatchConfig {
  size: number;
  map: MapKey;
  difficulty: Difficulty;
  mode: "ai" | "local";
}

export interface LogEntry {
  id: number;
  who: "p1" | "p2";
  text: string;
  kind: "hit" | "miss" | "sunk" | "ability" | "info";
}
