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
  const [copied, setCopied] = useState(false);
  const canShare = false; // Desabilitado para evitar erro de hidratação e inconsistência no mobile

  const onCopy = async () => {
    await copyText(GAME_URL);
    setCopied(true);
    toast.success("Endereço copiado", { description: GAME_URL });
    setTimeout(() => setCopied(false), 2500);
  };

  const onShare = async () => {
    try {
      await navigator.share({
        title: "Domínio do Oceano",
        text: "Jogue Domínio do Oceano comigo:",
        url: GAME_URL,
      });
    } catch {
      /* usuário cancelou */
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 backdrop-blur",
        className,
      )}
    >
      <Monitor className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        {!compact && <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>}
        <a
          href={GAME_URL}
          className="block truncate font-mono text-xs font-semibold text-foreground underline-offset-2 hover:underline sm:text-sm"
        >
          domineoceano.lovable.app
        </a>
      </div>
      <div className="ml-auto flex gap-2">
        <Button variant="outline" size="sm" onClick={onCopy} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
        {canShare && (
          <Button variant="ghost" size="sm" onClick={onShare} className="gap-2" aria-label="Compartilhar endereço">
            <Share2 className="h-4 w-4" /> Compartilhar
          </Button>
        )}
      </div>
    </div>
  );
}
