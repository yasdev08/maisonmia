"use client";

import { useEffect, useState } from "react";
import { Smartphone, Share, EllipsisVertical, X } from "lucide-react";
import { buttonBase, buttonVariants } from "@/components/LinkButton";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "ios" | "android" | "other";
type Mode = "hidden" | "native" | "guide";

function detect() {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const inApp = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|Bytedance|Snapchat/i.test(ua);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  const platform: Platform = ios ? "ios" : android ? "android" : "other";
  return { platform, inApp, standalone };
}

/** "Ajouter à l'écran d'accueil": native install prompt on Android/Chrome, step-by-step guide on iPhone. */
export function InstallAppButton() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [env, setEnv] = useState<ReturnType<typeof detect> | null>(null);
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = detect();
    setEnv(d);
    if (d.standalone) return; // already installed and opened from the home screen
    if (d.platform !== "other") setMode("guide");

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
      setMode("native");
    };
    const onInstalled = () => {
      setPrompt(null);
      setMode("hidden");
      setOpen(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (mode === "hidden" || !env) return null;

  const onClick = async () => {
    if (mode === "native" && prompt) {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      setPrompt(null); // the event can only be used once
      if (outcome === "accepted") setMode("hidden");
      else setMode(env.platform === "other" ? "hidden" : "guide");
      return;
    }
    setOpen((o) => !o);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={mode === "guide" ? open : undefined}
        aria-controls={mode === "guide" ? "install-guide" : undefined}
        className={`${buttonBase} ${buttonVariants.outline} cursor-pointer`}
      >
        <span className="grid size-6 shrink-0 place-items-center [&>svg]:size-[1.35rem]">
          <Smartphone aria-hidden="true" />
        </span>
        <span className="flex-1 text-[1.02rem] font-medium leading-tight">Ajouter à l’écran d’accueil</span>
        <span className="text-sm opacity-75">Accès rapide</span>
      </button>

      {mode === "guide" && open ? (
        <div
          id="install-guide"
          role="region"
          aria-label="Comment ajouter le site à l’écran d’accueil"
          className="relative rounded-2xl border border-line bg-ivory/80 p-4 pr-10 text-[0.95rem] leading-relaxed text-espresso"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="absolute top-2 right-2 grid size-9 place-items-center rounded-full text-espresso/70 hover:bg-champagne"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
          <Guide platform={env.platform} inApp={env.inApp} />
        </div>
      ) : null}
    </div>
  );
}

function Guide({ platform, inApp }: { platform: Platform; inApp: boolean }) {
  const browser = platform === "ios" ? "Safari" : "Chrome";
  return (
    <ol className="flex list-decimal flex-col gap-1.5 pl-5">
      {inApp ? (
        <li>
          Ouvrez d’abord cette page dans <strong>{browser}</strong> (menu <strong>⋯</strong> puis « Ouvrir dans le
          navigateur »).
        </li>
      ) : null}
      {platform === "ios" ? (
        <>
          <li>
            Touchez le bouton <strong>Partager</strong>{" "}
            <Share className="inline size-4 -translate-y-0.5 text-bronze-deep" aria-label="(icône Partager)" /> en bas
            de l’écran.
          </li>
          <li>
            Choisissez <strong>« Sur l’écran d’accueil »</strong>, puis <strong>Ajouter</strong>.
          </li>
        </>
      ) : (
        <>
          <li>
            Touchez le menu{" "}
            <EllipsisVertical className="inline size-4 -translate-y-0.5 text-bronze-deep" aria-label="(icône Menu)" />{" "}
            en haut à droite.
          </li>
          <li>
            Choisissez <strong>« Ajouter à l’écran d’accueil »</strong> ou <strong>« Installer l’application »</strong>.
          </li>
        </>
      )}
    </ol>
  );
}
