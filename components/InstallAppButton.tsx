"use client";

import { useEffect, useState } from "react";
import { Share, EllipsisVertical, X, Plus } from "lucide-react";

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
        className="mm-sheen group relative mt-1 w-full cursor-pointer rounded-[1.35rem] border border-bronze/70 p-1 text-left transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
      >
        <span className="flex items-center gap-4 rounded-[1.1rem] border border-line bg-gradient-to-br from-ivory via-champagne/70 to-champagne px-4 py-3.5 shadow-[0_14px_28px_-18px_rgba(125,69,32,0.65)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pwa-icon/192.png"
            alt=""
            width={52}
            height={52}
            className="size-13 shrink-0 rounded-[0.95rem] border border-line shadow-[0_6px_14px_-6px_rgba(42,26,18,0.45)]"
          />
          <span className="flex flex-1 flex-col">
            <span className="font-serif text-[1.3rem] font-medium leading-tight text-espresso">
              Ajouter à l’écran d’accueil
            </span>
            <span className="mt-0.5 text-sm text-bronze-deep">Comme une appli, en un geste</span>
          </span>
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-b from-bronze to-bronze-deep text-ivory shadow-[0_6px_14px_-6px_rgba(125,69,32,0.8)] transition-transform duration-200 group-hover:rotate-90"
          >
            <Plus className="size-5" />
          </span>
        </span>
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
