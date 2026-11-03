"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-b from-bronze to-bronze-deep px-6 font-medium text-ivory print:hidden"
    >
      <Printer className="size-5" aria-hidden="true" /> Imprimer l’affiche
    </button>
  );
}
