import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";
import { getLogoDataUri } from "@/lib/logo";

export const alt = "Maison Mia | Salon de coiffure et esthétique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files", file));

export default async function OpengraphImage() {
  const t = siteConfig.theme;
  const logo = getLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: t.ivory,
          fontFamily: "Cormorant",
          color: t.bronzeDeep,
        }}
      >
        <div
          style={{
            width: 1110,
            height: 540,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 56,
            border: `2px solid ${t.bronze}`,
            borderRadius: 24,
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" width={380} height={380} />
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", alignItems: logo ? "flex-start" : "center" }}>
            <div style={{ fontSize: 112, fontWeight: 500, lineHeight: 1 }}>{siteConfig.name}</div>
            <div style={{ fontSize: 40, fontStyle: "italic", color: t.bronze, marginTop: 18 }}>
              Salon de coiffure et esthétique
            </div>
            <div style={{ fontSize: 34, marginTop: 28 }}>{siteConfig.tagline}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: font("cormorant-garamond-latin-500-normal.woff"), weight: 500, style: "normal" },
        { name: "Cormorant", data: font("cormorant-garamond-latin-400-italic.woff"), weight: 400, style: "italic" },
      ],
    },
  );
}
