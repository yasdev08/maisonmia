import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/** Lets visitors install the site on their phone's home screen like an app. */
export default function manifest(): MetadataRoute.Manifest {
  const t = siteConfig.theme;
  return {
    id: "/",
    name: `${siteConfig.name} | ${siteConfig.category}`,
    short_name: siteConfig.name,
    description: `${siteConfig.category} à ${siteConfig.city}. ${siteConfig.tagline}`,
    lang: "fr",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: t.ivory,
    theme_color: t.bronze,
    icons: [
      { src: "/pwa-icon/192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
