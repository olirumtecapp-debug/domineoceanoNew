import carrier from "@/assets/ships/carrier.png";
import battleship from "@/assets/ships/battleship.png";
import cruiser from "@/assets/ships/cruiser.png";
import submarine from "@/assets/ships/submarine.png";
import frigate from "@/assets/ships/frigate.png";
import destroyer from "@/assets/ships/destroyer.png";
import patrol from "@/assets/ships/patrol.png";

import marAberto from "@/assets/env/mar_aberto.jpg";
import arquipelago from "@/assets/env/arquipelago.jpg";
import vulcanica from "@/assets/env/vulcanica.jpg";
import costa from "@/assets/env/costa.jpg";
import polar from "@/assets/env/polar.jpg";
import tropical from "@/assets/env/tropical.jpg";

import type { MapKey, ShipKey } from "./types";

export const SHIP_SPRITES: Record<ShipKey, string> = {
  carrier,
  battleship,
  cruiser,
  submarine,
  frigate,
  destroyer,
  patrol,
};

export const MAP_IMAGES: Record<MapKey, string> = {
  mar_aberto: marAberto,
  arquipelago,
  vulcanica,
  costa,
  polar,
  tropical,
};
