import { siteConfig } from "@/lib/site-config";

/** Hidden until `services.enabled` is true in site-config. Never shows invented prices. */
export function ServicesSection() {
  const { services } = siteConfig;
  if (!services.enabled) return null;

  return (
    <section aria-labelledby="serv-title" className="rounded-3xl border border-line bg-ivory/70 p-5">
      <h2 id="serv-title" className="font-serif text-2xl font-medium">
        Nos prestations
      </h2>
      {services.items.length ? (
        <ul className="mt-3 divide-y divide-line/70">
          {services.items.map((s) => (
            <li key={s.name} className="flex items-baseline justify-between gap-4 py-3">
              <div>
                <p className="font-medium">{s.name}</p>
                {s.description ? <p className="text-sm text-espresso/75">{s.description}</p> : null}
              </div>
              {s.startingPrice ? <p className="shrink-0 text-sm text-bronze-deep">dès {s.startingPrice}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[0.95rem] text-espresso/80">Contactez-nous pour découvrir nos prestations.</p>
      )}
    </section>
  );
}
