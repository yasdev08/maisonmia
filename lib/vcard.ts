import type { SiteConfig } from "./site-config";
import { buildSocials, toInternationalDZ } from "./links.ts";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");

/** RFC 6350-style folding at 75 chars, CRLF line endings. */
const fold = (line: string) => {
  const parts: string[] = [];
  for (let i = 0; i < line.length; i += 74) parts.push((i ? " " : "") + line.slice(i, i + 74));
  return parts.join("\r\n");
};

/** vCard 3.0 (best compatibility with iOS and Android). Only verified data from site-config. */
export function buildVCard(c: SiteConfig): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${esc(c.name)}`, `N:;${esc(c.name)};;;`, `ORG:${esc(c.name)}`];

  const wa = toInternationalDZ(c.contact.whatsappPhone);
  const call = toInternationalDZ(c.contact.callPhone);
  if (wa) lines.push(`TEL;TYPE=CELL,VOICE:+${wa}`);
  if (call && call !== wa) lines.push(`TEL;TYPE=WORK,VOICE:+${call}`);

  lines.push(`ADR;TYPE=WORK:;;${esc(c.location.streetAddress)};Oran;;;Algérie`);
  lines.push(`NOTE:${esc(`${c.category}. ${c.tagline}`)}`);
  if (c.location.mapsUrl) lines.push(`URL;TYPE=Maps:${c.location.mapsUrl}`);
  for (const s of buildSocials(c.social)) lines.push(`URL;TYPE=${s.label}:${s.href}`);

  lines.push("END:VCARD");
  return lines.map(fold).join("\r\n") + "\r\n";
}
