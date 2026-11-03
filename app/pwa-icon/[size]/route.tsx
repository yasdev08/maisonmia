import { renderAppIcon } from "@/lib/app-icon";

export const dynamic = "force-static";
export const dynamicParams = false;

const SIZES = [192, 512] as const;

export function generateStaticParams() {
  return SIZES.map((s) => ({ size: `${s}.png` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const px = Number((await params).size.replace(/\.png$/, ""));
  const res = renderAppIcon(px);
  res.headers.set("Cache-Control", "public, max-age=86400");
  return res;
}
