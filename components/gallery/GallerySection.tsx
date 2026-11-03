import { ImageIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { socialIcon } from "@/components/SocialLinks";
import { GalleryGrid } from "./GalleryGrid";

type Social = { id: "instagram" | "facebook" | "tiktok"; href: string; handle: string };

/** Photo gallery. Photos come only from site-config: nothing is invented. */
export function GallerySection({ instagram }: { instagram: Social | null }) {
  const { gallery } = siteConfig;
  if (!gallery.enabled) return null;
  const empty = gallery.items.length === 0;

  return (
    <section aria-labelledby="gal-title" className="rounded-3xl border border-line bg-ivory/70 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="gal-title" className="font-serif text-2xl font-medium">
          {gallery.title}
        </h2>
        {!empty ? (
          <p className="text-sm text-espresso/70">
            {gallery.items.length} photo{gallery.items.length > 1 ? "s" : ""}
          </p>
        ) : null}
      </div>

      {empty ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-t-[999px] rounded-b-2xl border border-bronze/40 p-1">
                <div className="grid aspect-[4/5] place-items-center rounded-t-[999px] rounded-b-xl border border-dashed border-line bg-gradient-to-b from-ivory to-champagne/60">
                  <ImageIcon className="size-6 text-bronze/45" strokeWidth={1.5} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[0.95rem] leading-relaxed text-espresso/80">
            Les photos de nos réalisations arrivent bientôt.
          </p>
          {instagram ? (
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-3 flex min-h-11 w-fit items-center gap-2 rounded-full border border-bronze/60 px-4 text-[0.95rem] font-medium text-bronze-deep hover:bg-ivory [&>svg]:size-4.5"
            >
              {socialIcon.instagram}
              En attendant, voir {instagram.handle}
            </a>
          ) : null}
        </>
      ) : (
        <GalleryGrid items={gallery.items} />
      )}
    </section>
  );
}
