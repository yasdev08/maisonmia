import { siteConfig } from "@/lib/site-config";
import { SocialLinks } from "@/components/SocialLinks";

type Socials = React.ComponentProps<typeof SocialLinks>["socials"];

export function Footer({ socials }: { socials: Socials }) {
  return (
    <footer className="mt-2 flex flex-col items-center gap-4 pb-2 text-center">
      <div>
        <p className="font-serif text-xl font-medium">{siteConfig.name}</p>
        <p className="text-sm text-espresso/75">
          {siteConfig.category} · {siteConfig.city}
        </p>
      </div>
      <SocialLinks socials={socials} />
      <p className="text-xs text-espresso/65">
        © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
      </p>
    </footer>
  );
}
