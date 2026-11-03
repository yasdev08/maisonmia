"use client";

/**
 * Client-side state for "add to home screen".
 * The browser's install offer (beforeinstallprompt) can fire before React loads, so an inline
 * script in <head> (INSTALL_BOOT_SCRIPT, lib/install-boot.ts) catches it early and parks it on window.__mmInstall.
 */
import { useSyncExternalStore } from "react";

export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __mmInstall?: InstallPromptEvent | null;
    __mmInstalled?: boolean;
  }
}

export type Platform = "ios" | "android" | "other";

export type InstallState = {
  ready: boolean;
  platform: Platform;
  /** Instagram / Facebook / TikTok… built-in browsers, which cannot install sites. */
  inApp: boolean;
  /** Already opened from the home screen. */
  standalone: boolean;
  /** Android/Chrome: one tap shows the system install dialog. */
  canPrompt: boolean;
  installed: boolean;
  sheetOpen: boolean;
};


const serverState: InstallState = {
  ready: false,
  platform: "other",
  inApp: false,
  standalone: false,
  canPrompt: false,
  installed: false,
  sheetOpen: false,
};

let state = serverState;
const listeners = new Set<() => void>();
let started = false;

function set(patch: Partial<InstallState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  // QR code links to /?install=1: open the guide straight away, then tidy the URL.
  const params = new URLSearchParams(location.search);
  const fromQr = params.has("install");
  if (fromQr) {
    params.delete("install");
    const q = params.toString();
    history.replaceState(null, "", location.pathname + (q ? `?${q}` : "") + location.hash);
  }

  const sync = () => set({ canPrompt: Boolean(window.__mmInstall), installed: Boolean(window.__mmInstalled) });
  window.addEventListener("mm:install", sync);

  state = {
    ready: true,
    platform: ios ? "ios" : android ? "android" : "other",
    inApp: /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|Bytedance|Snapchat/i.test(ua),
    standalone,
    canPrompt: Boolean(window.__mmInstall),
    installed: Boolean(window.__mmInstalled),
    sheetOpen: fromQr && !standalone,
  };
}

function subscribe(l: () => void) {
  start();
  listeners.add(l);
  queueMicrotask(l); // pick up the client snapshot right after hydration
  return () => listeners.delete(l);
}

export function useInstall() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}

/** Whether we have anything useful to offer on this device. */
export function canOffer(s: InstallState) {
  return s.ready && !s.standalone && !s.installed && (s.canPrompt || s.platform !== "other");
}

export function openSheet() {
  set({ sheetOpen: true });
}
export function closeSheet() {
  set({ sheetOpen: false });
}

/** One tap: system dialog when the browser allows it, otherwise the visual guide. */
export async function install() {
  const e = window.__mmInstall;
  if (!e) return openSheet();
  window.__mmInstall = null; // each offer can only be used once
  set({ canPrompt: false });
  await e.prompt();
  const { outcome } = await e.userChoice;
  if (outcome === "accepted") {
    window.__mmInstalled = true;
    set({ installed: true, sheetOpen: false });
  }
}

/** Android only: reopen the current page in Chrome from Instagram/Facebook/TikTok's browser. */
export function chromeIntentUrl() {
  const { host, pathname, search } = location;
  return `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;end`;
}
