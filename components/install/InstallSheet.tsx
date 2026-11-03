"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  EllipsisVertical,
  Ellipsis,
  ExternalLink,
  Lock,
  SquarePlus,
  Share,
  Copy as Tabs,
  X,
} from "lucide-react";
import { chromeIntentUrl, closeSheet, install, useInstall } from "@/lib/install-store";
import { siteConfig } from "@/lib/site-config";

/**
 * Bottom sheet that walks the customer through adding the site to their home screen.
 * Each step has a small drawing of the exact button to tap, so nobody has to guess.
 */
export function InstallSheet() {
  const s = useInstall();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!s.sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSheet();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [s.sheetOpen]);

  if (!s.sheetOpen) return null;

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const iosChrome = s.platform === "ios" && /CriOS/i.test(ua);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Fermer"
        tabIndex={-1}
        onClick={closeSheet}
        className="mm-fade absolute inset-0 cursor-default bg-espresso/45"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        className="mm-rise relative max-h-[92dvh] w-full max-w-[30rem] overflow-y-auto rounded-t-[1.75rem] border border-line bg-ivory px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-20px_50px_-20px_rgba(42,26,18,0.5)]"
      >
        <div className="mx-auto mb-3 h-1.5 w-11 rounded-full bg-line" aria-hidden="true" />
        <button
          ref={closeRef}
          type="button"
          onClick={closeSheet}
          aria-label="Fermer"
          className="absolute top-3 right-3 grid size-10 cursor-pointer place-items-center rounded-full text-espresso/70 hover:bg-champagne"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <header className="flex items-center gap-3.5 pr-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pwa-icon/192.png"
            alt=""
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-2xl border border-line shadow-[0_6px_14px_-6px_rgba(42,26,18,0.45)]"
          />
          <div>
            <h2 id="install-title" className="font-serif text-[1.6rem] font-medium leading-tight">
              {siteConfig.name} sur votre téléphone
            </h2>
            <p className="text-sm text-espresso/75">Gratuit · rien à télécharger · 10 secondes</p>
          </div>
        </header>

        <div className="mt-5 flex flex-col gap-3">
          {s.canPrompt ? (
            <OneTap />
          ) : (
            <>
              {s.inApp ? <OpenInBrowser platform={s.platform} /> : null}
              {s.platform === "ios" ? <IosSteps chrome={iosChrome} offset={s.inApp ? 1 : 0} /> : <AndroidSteps offset={s.inApp ? 1 : 0} />}
              <Result />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Android / Chrome with the system dialog available ---------- */

function OneTap() {
  return (
    <>
      <button
        type="button"
        onClick={install}
        className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-bronze to-bronze-deep px-5 text-[1.1rem] font-medium text-ivory shadow-[0_8px_20px_-10px_rgba(125,69,32,0.7)]"
      >
        <Download className="size-5" aria-hidden="true" />
        Installer maintenant
      </button>
      <p className="text-center text-sm text-espresso/75">
        Une fenêtre s’ouvre : touchez <strong>Installer</strong>. C’est tout.
      </p>
      <Result />
    </>
  );
}

/* ---------- Step building blocks ---------- */

function Step({ n, title, hint, children }: { n: number; title: ReactNode; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-champagne/35 p-3.5">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-bronze-deep font-serif text-lg font-semibold text-ivory">
          {n}
        </span>
        <div className="pt-0.5">
          <p className="text-[1.02rem] font-medium leading-snug">{title}</p>
          {hint ? <p className="mt-0.5 text-sm text-espresso/70">{hint}</p> : null}
        </div>
      </div>
      <div className="mt-3" aria-hidden="true">
        {children}
      </div>
    </section>
  );
}

/** A tappable-looking spot in the drawings, with a pulsing ring. */
function Hot({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`mm-pulse relative grid place-items-center rounded-lg bg-bronze/15 text-bronze-deep outline-2 outline-offset-0 outline-solid outline-bronze ${className}`}>
      {children}
    </span>
  );
}

function Mock({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-white/80 text-espresso/55 ${className}`}>{children}</div>;
}

function UrlPill() {
  return (
    <span className="flex h-7 flex-1 items-center gap-1.5 rounded-full bg-champagne/70 px-3 text-xs text-espresso/60">
      <Lock className="size-3" /> {typeof location !== "undefined" ? location.host : "maison-mia"}
    </span>
  );
}

function Result() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-bronze/50 p-3.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#3f7d4e] text-ivory">
        <Check className="size-4.5" aria-hidden="true" />
      </span>
      <p className="flex-1 text-[0.95rem] leading-snug">
        L’icône <strong>{siteConfig.name}</strong> apparaît sur votre écran d’accueil, à côté de vos applis.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/pwa-icon/192.png" alt="" width={40} height={40} className="size-10 rounded-[0.7rem] border border-line" />
    </div>
  );
}

/* ---------- In-app browsers (Instagram, Facebook, TikTok…) ---------- */

function OpenInBrowser({ platform }: { platform: InstallPlatform }) {
  const [copied, setCopied] = useState(false);
  const browser = platform === "ios" ? "Safari" : "Chrome";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.origin + "/?install=1");
      setCopied(true);
    } catch {}
  };

  return (
    <section className="rounded-2xl border border-bronze/60 bg-ivory p-3.5">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-bronze-deep font-serif text-lg font-semibold text-ivory">
          1
        </span>
        <div className="pt-0.5">
          <p className="text-[1.02rem] font-medium leading-snug">Ouvrez la page dans {browser}</p>
          <p className="mt-0.5 text-sm text-espresso/70">
            Vous êtes dans le navigateur d’Instagram, Facebook ou TikTok, qui ne permet pas l’ajout.
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {platform === "android" ? (
          <a
            href={chromeIntentUrl()}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-bronze to-bronze-deep px-4 font-medium text-ivory"
          >
            <ExternalLink className="size-4.5" aria-hidden="true" /> Ouvrir dans Chrome
          </a>
        ) : (
          <>
            <Mock className="flex items-center gap-2 px-3 py-2">
              <X className="size-4" />
              <span className="flex-1 truncate text-center text-xs">{siteConfig.name}</span>
              <Hot className="size-8">
                <Ellipsis className="size-5" />
              </Hot>
            </Mock>
            <p className="text-sm text-espresso/75">
              Touchez <strong>⋯</strong> en haut à droite, puis <strong>« Ouvrir dans Safari »</strong> (ou « Ouvrir dans le
              navigateur »).
            </p>
          </>
        )}
        <button
          type="button"
          onClick={copy}
          className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line text-[0.95rem] text-espresso/85"
        >
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? `Lien copié : collez-le dans ${browser}` : "Ou copier le lien"}
        </button>
      </div>
    </section>
  );
}

type InstallPlatform = ReturnType<typeof useInstall>["platform"];

/* ---------- iPhone / iPad ---------- */

function IosSteps({ chrome, offset }: { chrome: boolean; offset: number }) {
  return (
    <>
      {chrome ? (
        <Step n={1 + offset} title={<>Touchez le bouton Partager <Share className="inline size-4 -translate-y-0.5" /></>} hint="En haut, à droite de l’adresse du site.">
          <Mock className="flex items-center gap-2 px-3 py-2">
            <UrlPill />
            <Hot className="size-8">
              <Share className="size-4.5" />
            </Hot>
          </Mock>
        </Step>
      ) : (
        <Step
          n={1 + offset}
          title={<>Touchez le bouton Partager <Share className="inline size-4 -translate-y-0.5" /></>}
          hint={<>Il est en bas de l’écran. Vous ne le voyez pas ? Touchez d’abord <strong>⋯</strong>.</>}
        >
          <Mock className="flex items-center justify-around px-2 py-2">
            <ChevronLeft className="size-5" />
            <ChevronRight className="size-5" />
            <Hot className="size-9">
              <Share className="size-5" />
            </Hot>
            <BookOpen className="size-5" />
            <Tabs className="size-5" />
          </Mock>
          <p className="mm-bob mt-2 flex items-center justify-center gap-1 text-xs font-medium text-bronze-deep">
            <ArrowDown className="size-4" /> sous cette fenêtre, dans la barre de Safari
          </p>
        </Step>
      )}

      <Step
        n={2 + offset}
        title="Touchez « Sur l’écran d’accueil »"
        hint="Faites glisser la liste vers le haut si besoin."
      >
        <Mock className="divide-y divide-line/70 px-3 text-sm">
          <div className="flex items-center justify-between py-2">
            <span>Copier</span>
            <Copy className="size-4" />
          </div>
          <div className="-mx-1 my-1 flex items-center justify-between rounded-lg bg-bronze/12 px-2 py-2 font-medium text-espresso outline-2 outline-offset-0 outline-solid outline-bronze mm-pulse">
            <span>Sur l’écran d’accueil</span>
            <SquarePlus className="size-4.5 text-bronze-deep" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Ajouter un signet</span>
            <BookOpen className="size-4" />
          </div>
        </Mock>
      </Step>

      <Step n={3 + offset} title="Touchez « Ajouter »" hint="En haut à droite.">
        <Mock className="flex items-center justify-between px-3 py-2 text-sm">
          <span>Annuler</span>
          <span className="font-medium text-espresso/70">Sur l’écran d’accueil</span>
          <Hot className="px-2.5 py-1 font-semibold">Ajouter</Hot>
        </Mock>
      </Step>
    </>
  );
}

/* ---------- Android without the system dialog (Samsung Internet, Firefox, first visit…) ---------- */

function AndroidSteps({ offset }: { offset: number }) {
  return (
    <>
      <Step n={1 + offset} title={<>Touchez le menu <EllipsisVertical className="inline size-4 -translate-y-0.5" /></>} hint="Les 3 points en haut à droite (sur Samsung : ≡ en bas).">
        <Mock className="flex items-center gap-2 px-3 py-2">
          <UrlPill />
          <Hot className="size-8">
            <EllipsisVertical className="size-5" />
          </Hot>
        </Mock>
      </Step>

      <Step
        n={2 + offset}
        title="Touchez « Ajouter à l’écran d’accueil »"
        hint="Le nom peut aussi être « Installer l’application »."
      >
        <Mock className="divide-y divide-line/70 px-3 text-sm">
          <div className="flex items-center justify-between py-2">
            <span>Nouvel onglet</span>
          </div>
          <div className="-mx-1 my-1 flex items-center justify-between rounded-lg bg-bronze/12 px-2 py-2 font-medium text-espresso outline-2 outline-offset-0 outline-solid outline-bronze mm-pulse">
            <span>Ajouter à l’écran d’accueil</span>
            <SquarePlus className="size-4.5 text-bronze-deep" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Partager…</span>
          </div>
        </Mock>
      </Step>

      <Step n={3 + offset} title="Confirmez avec « Installer » ou « Ajouter »">
        <Mock className="flex items-center justify-end gap-4 px-3 py-2 text-sm">
          <span>Annuler</span>
          <Hot className="px-2.5 py-1 font-semibold">Installer</Hot>
        </Mock>
      </Step>
    </>
  );
}
