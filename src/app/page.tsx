import { siteConfig } from "@/config/site";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Logo } from "@/components/layout/Logo";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AccountingApp } from "@/components/sections/AccountingApp";
import { VirtualAddress } from "@/components/sections/VirtualAddress";
import { Hero } from "@/components/sections/Hero";
import { LeadForm } from "@/components/sections/LeadForm";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Segmentation } from "@/components/sections/Segmentation";
import { Services } from "@/components/sections/Services";

const { contact } = siteConfig;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AccountingService",
      "@id": `${siteConfig.url}/#empresa`,
      name: siteConfig.legalName,
      alternateName: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.png`,
      image: `${siteConfig.url}/images/hero-medico.webp`,
      telephone: "+55-31-3295-0497",
      email: contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.address.street,
        addressLocality: contact.address.city,
        addressRegion: contact.address.state,
        addressCountry: contact.address.country,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "18:00",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      knowsAbout: ["Contabilidade para médicos", "Planejamento tributário", "Abertura de CNPJ médico"],
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#pagina`,
      url: siteConfig.url,
      name: "Contabilidade para Médicos | Fechou Tributo",
      inLanguage: "pt-BR",
      about: { "@id": `${siteConfig.url}/#empresa` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header logo={<Logo preload />} />
      <main id="conteudo">
        <Hero />
        <Problem />
        <Services />
        <Process />
        <Segmentation />
        <VirtualAddress />
        <AccountingApp />
        <LeadForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
