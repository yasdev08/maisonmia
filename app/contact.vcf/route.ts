import { siteConfig } from "@/lib/site-config";
import { buildVCard } from "@/lib/vcard";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildVCard(siteConfig), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="maison-mia.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
