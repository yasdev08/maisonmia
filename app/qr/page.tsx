import type { Metadata } from "next";
import QRCode from "qrcode";
import { siteConfig } from "@/lib/site-config";
import { siteUrl } from "@/lib/site-url";
import { getLogo } from "@/lib/logo";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: `QR code | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

/** Printable poster for the salon counter: scanning opens the site with the install guide already open. */
export default async function QrPoster() {
  const target = `${siteUrl.replace(/\/$/, "")}/?install=1`;
  const svg = await QRCode.toString(target, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    color: { dark: siteConfig.theme.espresso, light: "#0000" },
  });
  const logo = getLogo();
  const display = target.replace(/^https?:\/\//, "").replace(/\/\?install=1$/, "");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[34rem] flex-col items-center justify-center gap-6 px-4 py-8 print:min-h-0 print:py-0">
      <div className="flex w-full flex-col items-center rounded-[2rem] border-2 border-bronze bg-ivory px-6 py-9 text-center print:border-bronze">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.src} alt={logo.alt} width={112} height={112} className="size-28" />
        ) : null}
        <h1 className="mt-4 font-serif text-[2.2rem] font-medium leading-tight">
          {siteConfig.name} sur votre téléphone
        </h1>
        <p className="mt-2 max-w-[30ch] text-[1.02rem] leading-relaxed text-espresso/80">
          Scannez avec l’appareil photo pour prendre rendez-vous en 1 touche, depuis votre écran d’accueil.
        </p>

        <div
          className="mt-6 w-[15rem] rounded-2xl border border-line bg-white p-4 [&>svg]:h-auto [&>svg]:w-full"
          role="img"
          aria-label={`QR code vers ${display}`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        <ol className="mt-6 grid w-full max-w-[22rem] gap-2 text-left text-[0.95rem]">
          {["Ouvrez l’appareil photo", "Visez le code et touchez le lien", "Suivez le guide : c’est ajouté !"].map((t, i) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-bronze-deep font-serif font-semibold text-ivory">
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-espresso/70">{display}</p>
      </div>
      <PrintButton />
    </main>
  );
}
