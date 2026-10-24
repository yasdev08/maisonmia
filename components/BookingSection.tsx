import { siteConfig } from "@/lib/site-config";
import { buildTelUrl, formatLocal } from "@/lib/links";

export function BookingSection({ whatsappHref }: { whatsappHref: string | null }) {
  const { contact, sections } = siteConfig;
  if (!sections.booking) return null;
  const phones = [contact.callPhone, contact.whatsappPhone]
    .map((p) => ({ p, tel: buildTelUrl(p) }))
    .filter((x): x is { p: string; tel: string } => Boolean(x.tel));
  if (!whatsappHref && !phones.length) return null;

  return (
    <section aria-labelledby="book-title" className="rounded-3xl border border-line bg-ivory/70 p-5 text-center">
      <h2 id="book-title" className="font-serif text-2xl font-medium">
        Prendre rendez-vous
      </h2>
      <p className="mx-auto mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed text-espresso/80">
        Écrivez-nous sur WhatsApp pour convenir d’un créneau, ou appelez directement le salon.
      </p>
      {phones.length ? (
        <p className="mt-3 text-[0.95rem] text-espresso/80">
          Si WhatsApp n’est pas disponible :{" "}
          {phones.map(({ p, tel }, i) => (
            <span key={p}>
              {i > 0 ? " ou " : ""}
              <a href={tel} className="inline-flex min-h-11 items-center font-medium text-bronze-deep underline underline-offset-4">
                {formatLocal(p)}
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
