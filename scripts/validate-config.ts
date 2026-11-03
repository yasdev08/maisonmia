import { siteConfig } from "../lib/site-config.ts";
import { buildVCard } from "../lib/vcard.ts";
import { buildSocials, buildTelUrl, buildWhatsAppUrl, toInternationalDZ, buildMapsEmbedUrl } from "../lib/links.ts";

let failed = 0;
const eq = (name: string, got: unknown, want: unknown) => {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `\n      got:  ${got}\n      want: ${want}`}`);
};

eq("normalize 0797715453", toInternationalDZ("0797715453"), "213797715453");
eq("normalize 0552896312", toInternationalDZ("0552896312"), "213552896312");
eq("normalize spaced", toInternationalDZ("07 97 71 54 53"), "213797715453");
eq("normalize +213", toInternationalDZ("+213 797 71 54 53"), "213797715453");
eq("reject garbage", toInternationalDZ("12345"), null);

const { contact, social, location } = siteConfig;
const wa = buildWhatsAppUrl(contact.whatsappPhone, contact.whatsappMessage)!;
eq("whatsapp base", wa.split("?")[0], "https://wa.me/213797715453");
eq("whatsapp message round-trips", decodeURIComponent(wa.split("?text=")[1]), contact.whatsappMessage);
eq("tel (call)", buildTelUrl(contact.callPhone), "tel:+213552896312");
eq("tel (whatsapp number fallback)", buildTelUrl(contact.whatsappPhone), "tel:+213797715453");

const s = buildSocials(social);
eq("instagram url", s.find((x) => x.id === "instagram")?.href, "https://www.instagram.com/maison.mia31/");
eq("facebook url", s.find((x) => x.id === "facebook")?.href, "https://www.facebook.com/maison.mia");
eq("tiktok url", s.find((x) => x.id === "tiktok")?.href, "https://www.tiktok.com/@maison.mia");
eq("hidden when handle empty", buildSocials({ instagram: "", facebook: "", tiktok: "" }).length, 0);

eq("maps url host", new URL(location.mapsUrl).hostname, "www.google.com");
eq("maps url keeps place id", location.mapsUrl.includes("0xd7e89f6d70c216d:0xd78f950cdcd36091"), true);
eq("coords match maps url", location.mapsUrl.includes(`!3d${location.latitude}!4d${location.longitude}`), true);
eq("embed url", buildMapsEmbedUrl(location.latitude, location.longitude), "https://www.google.com/maps?q=35.6746074,-0.6478291&z=17&hl=fr&output=embed");
eq("opening hours not invented", siteConfig.openingHours.length, 0);
eq("services not invented", siteConfig.services.items.length, 0);
eq("gallery not invented", siteConfig.gallery.items.length, 0);

const vc = buildVCard(siteConfig).replace(/\r\n /g, "");
eq("vcard wrapper", vc.startsWith("BEGIN:VCARD\r\nVERSION:3.0") && vc.trimEnd().endsWith("END:VCARD"), true);
eq("vcard whatsapp tel", vc.includes("TEL;TYPE=CELL,VOICE:+213797715453"), true);
eq("vcard call tel", vc.includes("TEL;TYPE=WORK,VOICE:+213552896312"), true);
eq("vcard instagram", vc.includes("https://www.instagram.com/maison.mia31/"), true);
eq("vcard no invented street", vc.includes("ADR;TYPE=WORK:;;;Oran;;;Algérie"), true);

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
