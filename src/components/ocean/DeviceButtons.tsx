import { useEffect, useState } from "react";
import { Maximize2, Minimize2, Download, Smartphone, Monitor, Copy, Check } from "lucide-react";
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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function FullscreenButton({ size = "sm" }: { size?: "sm" | "default" }) {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      toast.error("Tela cheia não disponível neste dispositivo.");
    }
  };

  return (
    <Button variant="outline" size={size} onClick={toggle} className="gap-2">
      {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      {isFs ? "Sair da tela cheia" : "Tela cheia"}
    </Button>
  );
}

export function InstallButton({ size = "sm" }: { size?: "sm" | "default" }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.origin);
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") toast.success("Instalando Ocean Dominion...");
    setDeferred(null);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Endereço copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={size} className="gap-2">
          <Download className="h-4 w-4" />
          {installed ? "App instalado" : "Instalar app"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Instalar Ocean Dominion</DialogTitle>
          <DialogDescription>
            Jogue no celular, tablet, notebook ou PC. O jogo pode ser instalado como aplicativo em todos eles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {deferred && (
            <Button onClick={install} className="w-full gap-2">
              <Download className="h-4 w-4" /> Instalar agora neste dispositivo
            </Button>
          )}

          <div className="rounded-lg border border-border p-4">
            <p className="flex items-center gap-2 font-semibold">
              <Smartphone className="h-4 w-4 text-primary" /> Celular e tablet
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                <strong>Android (Chrome):</strong> menu ⋮ → &quot;Instalar aplicativo&quot; ou &quot;Adicionar à tela inicial&quot;.
              </li>
              <li>
                <strong>iPhone / iPad (Safari):</strong> botão Compartilhar → &quot;Adicionar à Tela de Início&quot;.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="flex items-center gap-2 font-semibold">
              <Monitor className="h-4 w-4 text-primary" /> Computador e notebook
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Abra o endereço abaixo no Chrome ou Edge.</li>
              <li>Clique no ícone de instalar (monitor com seta) na barra de endereço.</li>
              <li>Ou use o menu ⋮ → &quot;Instalar Ocean Dominion&quot;.</li>
            </ul>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 truncate rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">{url}</code>
              <Button size="sm" variant="secondary" onClick={copyUrl} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copiar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
