import type { SiteConfig } from "./site-config";

/** "0797715453" | "07 97 71 54 53" | "+213 797…" -> "213797715453" (null if invalid). */
export function toInternationalDZ(input: string): string | null {
  let d = input.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("213")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  return /^[567]\d{8}$/.test(d) ? `213${d}` : null;
}

export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const intl = toInternationalDZ(phone);
  if (!intl) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${intl}${text}`;
}

export function buildTelUrl(phone: string): string | null {
  const intl = toInternationalDZ(phone);
  return intl ? `tel:+${intl}` : null;
}

/** "0797715453" -> "07 97 71 54 53" */
export function formatLocal(phone: string): string {
  const intl = toInternationalDZ(phone);
  if (!intl) return phone;
  const local = `0${intl.slice(3)}`;
  return local.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

const clean = (h: string) => h.trim().replace(/^@/, "");

export function buildSocials(c: SiteConfig["social"]) {
  const out: { id: "instagram" | "facebook" | "tiktok"; label: string; handle: string; href: string }[] = [];
  if (clean(c.instagram))
    out.push({ id: "instagram", label: "Instagram", handle: `@${clean(c.instagram)}`, href: `https://www.instagram.com/${clean(c.instagram)}/` });
  if (clean(c.facebook))
    out.push({ id: "facebook", label: "Facebook", handle: clean(c.facebook), href: `https://www.facebook.com/${clean(c.facebook)}` });
  if (clean(c.tiktok))
    out.push({ id: "tiktok", label: "TikTok", handle: `@${clean(c.tiktok)}`, href: `https://www.tiktok.com/@${clean(c.tiktok)}` });
  return out;
}

export function buildMapsEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=fr&output=embed`;
}
