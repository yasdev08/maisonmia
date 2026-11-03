import { ImageResponse } from "next/og";
import { siteConfig } from "./site-config";
import { getLogoDataUri } from "./logo";

/**
 * Home-screen icon: the round logo centred on ivory. The logo fills ~76% of the
 * square so it stays inside the maskable "safe zone" (Android crops to a circle/squircle).
 */
export function renderAppIcon(px: number) {
  const logo = getLogoDataUri();
  const inner = Math.round(px * 0.76);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: siteConfig.theme.ivory,
          color: siteConfig.theme.bronzeDeep,
          fontSize: Math.round(px * 0.5),
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" width={inner} height={inner} />
        ) : (
          "M"
        )}
      </div>
    ),
    { width: px, height: px },
  );
}
