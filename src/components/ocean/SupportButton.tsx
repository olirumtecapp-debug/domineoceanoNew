import { useState } from "react";
import { Heart, Copy, Check, QrCode } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const PIX_CODE =
  "00020101021126420014br.gov.bcb.pix0120olirumdev1@gmail.com5204000053039865802BR5918MURILO SILVA - PIJ6008BRASILIA62070503***630432FF";

export function SupportButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CODE);
    } catch {
      const el = document.createElement("textarea");
      el.value = PIX_CODE;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    toast.success("Código Pix copiado", {
      description: "Cole no app do seu banco para concluir o apoio.",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          <Heart className="h-4 w-4 fill-destructive text-destructive" />
          Apoiar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-destructive text-destructive" />
            Apoie o Ocean Dominion
          </DialogTitle>
          <DialogDescription>
            Este jogo é gratuito. Se ele te divertiu, considere apoiar o desenvolvimento com qualquer valor via Pix.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Favorecido</span>
              <span className="font-medium">Murilo Silva</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium">
              Pix copia e cola
            </p>
            <textarea
              readOnly
              value={PIX_CODE}
              onFocus={(e) => e.currentTarget.select()}
              className="h-24 w-full resize-none rounded-md border border-border bg-background/70 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground"
            />
            <Button onClick={copy} className="w-full gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Código Pix copiado" : "Copiar código Pix"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
