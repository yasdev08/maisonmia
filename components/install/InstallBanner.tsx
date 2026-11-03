"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { canOffer, install, useInstall } from "@/lib/install-store";

const KEY = "mm-install-banner-dismissed";
const QUIET_DAYS = 14;

function recentlyDismissed() {
  try {
    const t = Number(localStorage.getItem(KEY));
    return Number.isFinite(t) && Date.now() - t < QUIET_DAYS * 864e5;
  } catch {
    return false;
  }
}

/** Slim bar that slides up a few seconds after arrival, on phones only. */
export function InstallBanner() {
  const s = useInstall();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!canOffer(s) || s.platform === "other" || recentlyDismissed()) return;
    const t = setTimeout(() => setShow(true), 3500);
    return () => clearTimeout(t);
  }, [s]);

  if (!show || !canOffer(s) || s.sheetOpen) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {}
  };

  return (
    <div className="mm-rise fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div
        role="region"
        aria-label="Installer Maison Mia"
        className="mx-auto flex max-w-[28rem] items-center gap-3 rounded-2xl border border-bronze/60 bg-ivory/95 p-2.5 pl-3 shadow-[0_18px_40px_-18px_rgba(42,26,18,0.55)] backdrop-blur"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pwa-icon/192.png" alt="" width={40} height={40} className="size-10 shrink-0 rounded-[0.7rem] border border-line" />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-[1.1rem] font-medium leading-tight">Maison Mia sur votre téléphone</p>
          <p className="text-[0.8rem] text-espresso/75">Retrouvez-nous en 1 touche, comme une appli</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShow(false);
            install();
          }}
          className="min-h-11 shrink-0 cursor-pointer rounded-xl bg-gradient-to-b from-bronze to-bronze-deep px-4 text-[0.95rem] font-medium text-ivory"
        >
          Ajouter
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Plus tard"
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-espresso/60 hover:bg-champagne"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
