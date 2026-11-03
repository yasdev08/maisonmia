import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

/** Set NEXT_PUBLIC_SITE_URL (e.g. https://maisonmia.dz) once the domain is known. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const title = `${siteConfig.name} | Salon de Coiffure et Esthétique`;
const description = `${siteConfig.name}, salon de coiffure et esthétique à Oran. ${siteConfig.tagline} Prenez rendez-vous par WhatsApp ou par téléphone.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: siteConfig.name,
  alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title,
    description,
    url: "/",
  },
  appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: siteConfig.theme.bronze,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const t = siteConfig.theme;
  const vars = {
    "--mm-ivory": t.ivory,
    "--mm-champagne": t.champagne,
    "--mm-bronze": t.bronze,
    "--mm-bronze-deep": t.bronzeDeep,
    "--mm-espresso": t.espresso,
    "--mm-line": t.line,
  } as React.CSSProperties;

  return (
    <html lang="fr" style={vars}>
      <body>{children}</body>
    </html>
  );
}
