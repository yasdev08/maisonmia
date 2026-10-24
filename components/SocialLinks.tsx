import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

type Social = { id: "instagram" | "facebook" | "tiktok"; label: string; href: string };

export const socialIcon = {
  instagram: <InstagramIcon />,
  facebook: <FacebookIcon />,
  tiktok: <TikTokIcon />,
};

/** Compact icon row (used in the footer). */
export function SocialLinks({ socials }: { socials: Social[] }) {
  if (!socials.length) return null;
  return (
    <ul className="flex items-center justify-center gap-3">
      {socials.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label} Maison Mia`}
            className="grid size-11 place-items-center rounded-full border border-line text-bronze-deep transition hover:border-bronze hover:bg-ivory [&>svg]:size-[1.15rem]"
          >
            {socialIcon[s.id]}
          </a>
        </li>
      ))}
    </ul>
  );
}
