import { renderAppIcon } from "@/lib/app-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iPhone "Sur l'écran d'accueil" icon. */
export default function AppleIcon() {
  return renderAppIcon(180);
}
