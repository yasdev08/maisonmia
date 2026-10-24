import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Neutral "M" monogram favicon. Replace by dropping an app/icon.png made from the real logo. */
export default function Icon() {
  const data = fs.readFileSync(
    path.join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: siteConfig.theme.bronze,
          color: siteConfig.theme.ivory,
          fontSize: 46,
          fontFamily: "Cormorant",
          fontWeight: 600,
          borderRadius: 32,
        }}
      >
        M
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data, weight: 600, style: "normal" }] },
  );
}
