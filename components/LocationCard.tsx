import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMapsEmbedUrl } from "@/lib/links";

export function LocationCard() {
  const { location, openingHours, sections } = siteConfig;
  if (!sections.location || !location.mapsUrl) return null;
  const hasCoords = Number.isFinite(location.latitude) && Number.isFinite(location.longitude);

  return (
    <section aria-labelledby="loc-title" className="rounded-3xl border border-line bg-ivory/70 p-5">
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 size-5 shrink-0 text-bronze" aria-hidden="true" />
        <div>
          <h2 id="loc-title" className="font-serif text-2xl font-medium leading-tight">
            Nous trouver
          </h2>
          <p className="mt-1 text-[0.95rem] text-espresso/80">{location.label}</p>
          {location.streetAddress ? <p className="text-[0.95rem] text-espresso/80">{location.streetAddress}</p> : null}
        </div>
      </div>

      {location.embedMap && hasCoords ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-line">
          <iframe
            title="Carte : emplacement de Maison Mia à Oran"
            src={buildMapsEmbedUrl(location.latitude, location.longitude)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[4/3] w-full"
            allowFullScreen
          />
        </div>
      ) : null}

      {sections.hours && openingHours.length ? (
        <dl className="mt-4 space-y-1 text-[0.95rem]">
          {openingHours.map((h) => (
            <div key={h.days} className="flex justify-between gap-4 border-t border-line/70 pt-1">
              <dt>{h.days}</dt>
              <dd className="text-espresso/80">{h.hours}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <a
        href={location.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 items-center text-[0.95rem] font-medium text-bronze-deep underline decoration-bronze/40 underline-offset-4 hover:decoration-bronze"
      >
        Ouvrir dans Google Maps
      </a>
    </section>
  );
}
