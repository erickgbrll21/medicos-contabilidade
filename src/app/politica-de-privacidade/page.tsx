import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = {
  title: "Política de Privacidade | BC Consultores",
  description: "Como a BC Consultores trata os dados enviados pelo formulário da página de contabilidade para médicos.",
  alternates: { canonical: "/politica-de-privacidade" },
};

const sections = [
  {
    title: "Quem trata os seus dados",
    body: [
      `Os dados enviados nesta página são tratados pela ${siteConfig.legalName} (BC Consultores), com sede na ${siteConfig.contact.address.street}, ${siteConfig.contact.address.district}, ${siteConfig.contact.address.city} – ${siteConfig.contact.address.state}.`,
    ],
  },
  {
    title: "Quais dados coletamos",
    body: [
      "Pelo formulário: nome, WhatsApp, e-mail, especialidade médica, cidade e estado, se você possui CNPJ, seu principal objetivo e, se você quiser informar, a faixa de faturamento mensal e observações.",
      "Automaticamente: a página de origem, a data e o horário do envio e os parâmetros de campanha presentes no endereço (por exemplo, utm_source, utm_campaign, gclid e fbclid), que ficam guardados no seu navegador por até 30 dias.",
      "Não solicitamos CPF, documentos pessoais nem informações clínicas de pacientes. Pedimos que você não as inclua no campo de observações.",
    ],
  },
  {
    title: "Para que usamos",
    body: [
      "Para entrar em contato com você, entender sua situação contábil e tributária e apresentar informações sobre nossos serviços.",
      "Para medir o desempenho das nossas campanhas e desta página.",
    ],
  },
  {
    title: "Base legal",
    body: [
      "O tratamento é feito com base no seu consentimento (art. 7º, I, da Lei nº 13.709/2018 – LGPD), registrado quando você marca a autorização no formulário, e para procedimentos preliminares relacionados a um eventual contrato a seu pedido (art. 7º, V).",
    ],
  },
  {
    title: "Com quem compartilhamos",
    body: [
      "Com o sistema de gestão de relacionamento (CRM) usado pela nossa equipe comercial, que armazena o seu contato.",
      "Com ferramentas de medição de audiência, como Google Analytics e Meta Pixel, quando ativas nesta página. Essas ferramentas recebem dados de navegação e dos eventos da página, não o conteúdo do formulário.",
      "Se você optar por continuar a conversa pelo WhatsApp, a mensagem é enviada por você diretamente pelo aplicativo, sujeito às políticas do WhatsApp.",
    ],
  },
  {
    title: "Por quanto tempo guardamos",
    body: [
      "Pelo tempo necessário para o atendimento da sua solicitação e para o cumprimento de obrigações legais. Você pode pedir a exclusão a qualquer momento.",
    ],
  },
  {
    title: "Seus direitos",
    body: [
      "Você pode solicitar confirmação do tratamento, acesso, correção, anonimização, portabilidade, exclusão dos dados e revogação do consentimento, nos termos do art. 18 da LGPD.",
      `Para exercer esses direitos, escreva para ${siteConfig.contact.email} ou ligue para ${siteConfig.contact.phoneDisplay}.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="surface-dark">
        <div className="container-page flex h-16 items-center justify-between lg:h-[4.5rem]">
          <Link href="/" aria-label="BC Consultores — página inicial">
            <Logo />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-[0.9375rem] text-white/75 hover:text-white">
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Voltar
          </Link>
        </div>
      </header>

      <main id="conteudo" className="bg-white py-20 sm:py-28">
        <article className="container-page max-w-[48rem]">
          <h1 className="text-section">Política de Privacidade</h1>
          <p className="text-lead mt-6 text-muted">
            Esta política explica como tratamos os dados enviados pela página de contabilidade para médicos. Ela
            complementa a{" "}
            <a href={siteConfig.officialPrivacyPolicy} target="_blank" rel="noopener noreferrer" className="text-ink underline">
              política de privacidade do site institucional
            </a>
            .
          </p>

          <div className="mt-14 space-y-12">
            {sections.map((section) => (
              <section key={section.title} className="border-t border-line pt-8">
                <h2 className="text-[1.5rem] leading-tight tracking-[-0.015em]">{section.title}</h2>
                <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-muted">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <Footer linkBase="/" />
    </>
  );
}
