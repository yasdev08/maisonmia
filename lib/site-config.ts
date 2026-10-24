/**
 * MAISON MIA — single source of truth.
 * Edit this file only. Leave a value as "" (or an empty list) and the
 * matching button/section is hidden automatically.
 */

export const siteConfig = {
  name: "Maison Mia",
  category: "Salon de coiffure et esthétique",
  tagline: "Votre beauté, notre signature.",
  intro:
    "Un espace dédié à la beauté, au bien-être et à la mise en valeur de votre élégance.",
  city: "Oran, Algérie",
  locale: "fr_DZ",

  /** Put the original logo at this path (inside /public). PNG recommended. */
  logo: {
    src: "/images/maison-mia-logo.png",
    alt: "Logo Maison Mia, salon de coiffure et esthétique",
    /** Small (<200 KB) version used only for the social preview image. Never point this at a full-size file. */
    ogSrc: "/images/maison-mia-logo-og.png",
  },

  /** Numbers in national Algerian format (leading 0). Converted automatically. */
  contact: {
    whatsappPhone: "0797715453", // WhatsApp (booking)
    callPhone: "0552896312", // Appeler le salon
    whatsappMessage:
      "Bonjour Maison Mia, je souhaite prendre rendez-vous. Pourriez-vous m’indiquer vos disponibilités ?",
  },

  location: {
    label: "Oran, Algérie",
    /** Street address not confirmed: intentionally empty. */
    streetAddress: "",
    mapsUrl:
      "https://www.google.com/maps/place/Maison+Mia/@35.6745986,-0.6480765,21z/data=!4m10!1m2!2m1!1sMaison+Mia!3m6!1s0xd7e89f6d70c216d:0xd78f950cdcd36091!8m2!3d35.6746074!4d-0.6478291!15sCgpNYWlzb24gTWlhkgEMYmVhdXR5X3NhbG9u4AEA!16s%2Fg%2F11z_sdbqx1?hl=fr&entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D",
    latitude: 35.6746074,
    longitude: -0.6478291,
    embedMap: true,
  },

  /** Handles only; full URLs are built in lib/links.ts. */
  social: {
    instagram: "maison.mia31",
    facebook: "maison.mia",
    tiktok: "maison.mia",
  },

  /** Not confirmed yet. Example: [{ days: "Lundi – Samedi", hours: "09:00 – 18:00" }] */
  openingHours: [] as { days: string; hours: string }[],

  /** Not confirmed yet: section stays hidden until you add real items. */
  services: {
    enabled: false,
    items: [] as { name: string; description?: string; startingPrice?: string }[],
  },

  sections: {
    location: true,
    booking: true,
    hours: true,
  },

  theme: {
    ivory: "#fbf6ee",
    champagne: "#f0e4d0",
    bronze: "#a45f2e",
    bronzeDeep: "#7d4520",
    espresso: "#2a1a12",
    line: "#d8c2a3",
  },
};

export type SiteConfig = typeof siteConfig;
