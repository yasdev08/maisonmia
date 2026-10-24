import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "./site-config";

export type LogoAsset = { src: string; width: number; height: number; alt: string };

/** Reads the real logo from /public and its true pixel size (PNG) so the aspect ratio is never distorted. */
export function getLogo(): LogoAsset | null {
  try {
    const file = path.join(process.cwd(), "public", siteConfig.logo.src);
    if (!fs.existsSync(file)) return null;
    const buf = fs.readFileSync(file);
    const isPng = buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG";
    if (!isPng) return { src: siteConfig.logo.src, width: 600, height: 600, alt: siteConfig.logo.alt };
    return {
      src: siteConfig.logo.src,
      width: buf.readUInt32BE(16),
      height: buf.readUInt32BE(20),
      alt: siteConfig.logo.alt,
    };
  } catch {
    return null;
  }
}

export function getLogoDataUri(): string | null {
  try {
    const file = path.join(process.cwd(), "public", siteConfig.logo.src);
    if (!fs.existsSync(file)) return null;
    return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
  } catch {
    return null;
  }
}
