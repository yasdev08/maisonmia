import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { getLogo } from "@/lib/logo";

/** Arched "mirror" frame: the logo sits in a window-shaped frame with a fine double bronze line. */
export function BrandHeader() {
  const logo = getLogo();

  return (
    <header className="flex flex-col items-center text-center">
      <div className="rounded-t-[999px] rounded-b-3xl border border-bronze/70 p-1.5">
        <div className="grid h-52 w-40 place-items-center overflow-hidden rounded-t-[999px] rounded-b-2xl border border-line bg-ivory px-5 pt-8 pb-4">
          {logo ? (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              priority
              sizes="160px"
              className="h-auto max-h-full w-full object-contain"
            />
          ) : (
            <span className="font-serif text-4xl font-medium leading-none text-bronze-deep" aria-hidden="true">
              Maison
              <br />
              Mia
            </span>
          )}
        </div>
      </div>

      <h1 className="mt-7 font-serif text-[2.6rem] font-medium leading-none tracking-tight text-espresso">
        {siteConfig.name}
      </h1>
      <p className="mt-2 font-serif text-xl italic text-bronze-deep">Salon de coiffure &amp; esthétique</p>
      <p className="mt-5 font-serif text-2xl leading-snug text-espresso">{siteConfig.tagline}</p>
      <p className="mt-3 max-w-[32ch] text-[0.95rem] leading-relaxed text-espresso/80">{siteConfig.intro}</p>
    </header>
  );
}
