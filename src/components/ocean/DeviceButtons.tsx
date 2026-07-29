import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Download, Share, Chrome } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "android" | "ios" | "desktop" | "hidden";

const DISMISS_KEY = "od:install-dismissed";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia?.("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
}

export function InstallButton({ size = "sm" }: { size?: "sm" | "default" }) {
  const [platform, setPlatform] = useState<Platform>("hidden");
  const [open, setOpen] = useState(false);
  const deferredRef = useRef<BIPEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    const onBIP = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BIPEvent;
      setPlatform("android");
    };
    const onInstalled = () => setPlatform("hidden");
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    if (isIOS()) {
      setPlatform("ios");
      return () => {
        window.removeEventListener("beforeinstallprompt", onBIP);
        window.removeEventListener("appinstalled", onInstalled);
      };
    }

    const timer = window.setTimeout(() => {
      if (!deferredRef.current) {
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        setPlatform(coarse ? "hidden" : "desktop");
      }
    }, 1500);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (platform === "hidden") return null;

  const onClick = async () => {
    if (platform === "android" && deferredRef.current) {
      try {
        await deferredRef.current.prompt();
        const choice = await deferredRef.current.userChoice;
        if (choice.outcome === "accepted") setPlatform("hidden");
      } catch {
        /* ignore */
      }
      deferredRef.current = null;
      return;
    }
    setOpen(true);
  };

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setPlatform("hidden");
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size={size} onClick={onClick} className="gap-2" aria-label="Instalar app">
        <Download className="h-4 w-4" /> Instalar app
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Instalar Ocean Dominion</DialogTitle>
            <DialogDescription>
              {platform === "ios"
                ? "No iPhone/iPad, toque no botão Compartilhar na barra do Safari e escolha \u201cAdicionar à Tela de Início\u201d. O jogo abrirá como um app."
                : "Seu navegador não suporta instalação de app. Use Chrome, Edge ou Brave para instalar o Ocean Dominion como um aplicativo no seu computador."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm text-muted-foreground">
            {platform === "ios" ? (
              <Share className="h-5 w-5 shrink-0 text-primary" />
            ) : (
              <Chrome className="h-5 w-5 shrink-0 text-primary" />
            )}
            <span>
              {platform === "ios"
                ? "Safari → Compartilhar ⬆ → Adicionar à Tela de Início"
                : "Chrome/Edge/Brave → ícone de instalar na barra de endereço"}
            </span>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={dismiss}>
              Não mostrar novamente
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function FullscreenButton({ size = "sm" }: { size?: "sm" | "default" }) {
  const [supported, setSupported] = useState(false);
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const d = document as Document & { webkitFullscreenEnabled?: boolean };
    setSupported(Boolean(d.fullscreenEnabled ?? d.webkitFullscreenEnabled));
    const onChange = () => {
      const el =
        document.fullscreenElement ??
        (document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement;
      setIsFs(Boolean(el));
    };
    onChange();
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange as EventListener);
    };
  }, []);

  if (!supported) return null;

  const toggle = async () => {
    try {
      const d = document as Document & { webkitExitFullscreen?: () => Promise<void> };
      const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
      if (isFs) await (d.exitFullscreen?.() ?? d.webkitExitFullscreen?.());
      else await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.());
    } catch {
      /* ignore */
    }
  };

  return (
    <Button variant="outline" size={size} onClick={toggle} className="gap-2">
      {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      {isFs ? "Sair da tela cheia" : "Tela cheia"}
    </Button>
  );
}
