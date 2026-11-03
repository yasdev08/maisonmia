"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Item = { src: string; alt: string; caption?: string };

/** Thumbnail grid + full-screen viewer (tap, swipe, arrow keys, Esc). */
export function GalleryGrid({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );
  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go, close]);

  const current = open === null ? null : items[open];

  return (
    <>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {items.map((it, i) => (
          <li key={it.src} className={items.length % 2 === 1 && i === 0 ? "col-span-2" : undefined}>
            <button
              type="button"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Agrandir : ${it.alt}`}
              className="group block w-full cursor-zoom-in rounded-t-[999px] rounded-b-2xl border border-bronze/50 p-1"
            >
              <span
                className={`relative block overflow-hidden rounded-t-[999px] rounded-b-xl bg-champagne ${
                  items.length % 2 === 1 && i === 0 ? "aspect-[16/11]" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  sizes="(max-width: 28rem) 50vw, 220px"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </span>
            </button>
            {it.caption ? <p className="mt-1.5 text-center text-sm text-espresso/75">{it.caption}</p> : null}
          </li>
        ))}
      </ul>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${open! + 1} sur ${items.length}`}
          className="mm-fade fixed inset-0 z-50 flex flex-col bg-espresso/95 text-ivory"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <p className="pl-2 text-sm text-ivory/75">
              {open! + 1} / {items.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-ivory/10"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1" onClick={close}>
            <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" className="mm-fade object-contain" />
          </div>

          <div className="flex items-center gap-3 px-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Photo précédente"
                className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-ivory/25 hover:bg-ivory/10"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
            ) : null}
            <p className="flex-1 text-center text-[0.95rem] text-ivory/85">{current.caption ?? ""}</p>
            {items.length > 1 ? (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Photo suivante"
                className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-ivory/25 hover:bg-ivory/10"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
