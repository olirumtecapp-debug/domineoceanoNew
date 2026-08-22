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
  return null;
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
