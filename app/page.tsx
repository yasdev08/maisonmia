import { MessageCircle, Phone, MapPin, UserPlus } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildSocials, buildTelUrl, buildWhatsAppUrl, formatLocal } from "@/lib/links";
import { BrandHeader } from "@/components/BrandHeader";
import { LinkButton } from "@/components/LinkButton";
import { socialIcon } from "@/components/SocialLinks";
import { ServicesSection } from "@/components/ServicesSection";
import { LocationCard } from "@/components/LocationCard";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { InstallAppButton } from "@/components/InstallAppButton";

export default function Home() {
  const { contact, location } = siteConfig;
  const whatsappHref = buildWhatsAppUrl(contact.whatsappPhone, contact.whatsappMessage);
  const callHref = buildTelUrl(contact.callPhone);
  const socials = buildSocials(siteConfig.social);

  return (
    <main className="mx-auto flex w-full max-w-[28rem] flex-col px-4 py-8 sm:py-12">
      <div className="mm-settle flex flex-col gap-8 rounded-[2rem] border border-line bg-ivory/55 px-5 py-9 shadow-[0_30px_60px_-40px_rgba(42,26,18,0.45)] sm:px-7">
        <BrandHeader />

        <nav aria-label="Actions principales" className="flex flex-col gap-3">
          {whatsappHref ? (
            <LinkButton
              variant="primary"
              external
              href={whatsappHref}
              label="Prendre rendez-vous sur WhatsApp"
              icon={<MessageCircle aria-hidden="true" />}
            />
          ) : null}
          {callHref ? (
            <LinkButton
              href={callHref}
              label="Appeler le salon"
              hint={formatLocal(contact.callPhone)}
              icon={<Phone aria-hidden="true" />}
            />
          ) : null}
          {location.mapsUrl ? (
            <LinkButton
              external
              href={location.mapsUrl}
              label="Nous trouver sur Google Maps"
              icon={<MapPin aria-hidden="true" />}
            />
          ) : null}
          <LinkButton
            href="/contact.vcf"
            label="Enregistrer le contact"
            hint="Ajouter au téléphone"
            icon={<UserPlus aria-hidden="true" />}
          />
          <InstallAppButton />
          {socials.map((s) => (
            <LinkButton
              key={s.id}
              variant="quiet"
              external
              href={s.href}
              label={s.label}
              hint={s.handle}
              icon={socialIcon[s.id]}
            />
          ))}
        </nav>

        <ServicesSection />
        <LocationCard />
        <BookingSection whatsappHref={whatsappHref} />
        <Footer socials={socials} />
      </div>
    </main>
  );
}
