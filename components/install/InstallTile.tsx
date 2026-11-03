"use client";

import { Plus } from "lucide-react";
import { canOffer, install, useInstall } from "@/lib/install-store";

/** The "app tile" in the main action list. */
export function InstallTile() {
  const s = useInstall();
  if (!canOffer(s)) return null;

  return (
    <button
      type="button"
      onClick={install}
      aria-haspopup={s.canPrompt ? undefined : "dialog"}
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
          <span className="mt-0.5 text-sm text-bronze-deep">
            {s.canPrompt ? "Gratuit · s’installe en 1 touche" : "Gratuit · guide en images, 10 secondes"}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-b from-bronze to-bronze-deep text-ivory shadow-[0_6px_14px_-6px_rgba(125,69,32,0.8)] transition-transform duration-200 group-hover:rotate-90"
        >
          <Plus className="size-5" />
        </span>
      </span>
    </button>
  );
}
