import { useState } from "react";
import { Copy, Check, Monitor, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const GAME_URL = "https://domineoceano.lovable.app";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  }
}

export function GameLink({
  className,
  compact = false,
  label = "Jogue no computador",
}: {
  className?: string;
  compact?: boolean;
  label?: string;
}) {
  return null;
}
