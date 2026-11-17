import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = {
  title: "Política de Privacidade | Fechou Tributo",
  description: "Como a Fechou Tributo trata os dados enviados pelo formulário da página de contabilidade para médicos.",
  alternates: { canonical: "/politica-de-privacidade" },
};

const { contact } = siteConfig;

const sections = [
  {
    title: "Controlador e canal do titular",
    body: [
      `O controlador dos dados desta página é a ${siteConfig.legalName}, com sede na ${contact.address.street}, ${contact.address.district}, ${contact.address.city} – ${contact.address.state}.`,
      `O canal do encarregado e dos titulares é o e-mail ${contact.email} e o telefone ${contact.phoneDisplay}, em horário comercial (${contact.hours}). Pedidos de acesso completo são respondidos em até 15 dias.`,
    ],
  },
  {
    title: "Quais dados e para quê",
    body: [
      "Formulário, com a sua autorização: nome, WhatsApp, e-mail, especialidade, cidade, estado, se você possui CNPJ e o seu objetivo. Faturamento e observações só entram se você quiser informar. A finalidade é o contato comercial e a preparação de uma proposta de contabilidade.",
      "Cookies de medição, só se você aceitar: página visitada, origem da campanha (por exemplo, utm_source, utm_campaign, gclid e fbclid) e eventos da página, guardados no navegador por até 30 dias. A finalidade é medir o desempenho desta página.",
      "Não pedimos CPF, documentos nem dados de saúde de pacientes. Especialidade médica, sozinha, não é dado de saúde. Não use o campo de observações para dados clínicos. Esta página não se destina a crianças.",
    ],
  },
  {
    title: "Base legal",
    body: [
      "O contato comercial usa o seu consentimento (art. 7º, I, da Lei nº 13.709/2018) e, quando você pede uma proposta, os procedimentos preliminares do contrato (art. 7º, V).",
      "A medição de visitas usa um consentimento separado, no aviso de cookies. Ele é livre, específico e pode ser recusado sem impedir o uso do site. Caixa marcada de antemão não é usada.",
      "Não há decisão automatizada nem perfilamento sobre você (art. 20).",
    ],
  },
  {
    title: "Com quem compartilhamos e transferência internacional",
    body: [
      "O formulário vai para o CRM da equipe comercial, que atua como operador e só trata os dados para o atendimento do seu pedido.",
      "Se você aceitar os cookies, Google Analytics e Meta Pixel podem tratar dados de navegação fora do Brasil, inclusive nos Estados Unidos. Essa transferência internacional se apoia no consentimento específico do aviso (art. 33). O conteúdo do formulário não é enviado a essas ferramentas.",
      "Se você seguir a conversa pelo WhatsApp, a mensagem sai do seu próprio aplicativo, sujeito às regras do WhatsApp.",
    ],
  },
  {
    title: "Por quanto tempo guardamos",
    body: [
      "Os dados do formulário ficam pelo tempo do atendimento e das obrigações legais aplicáveis. A origem da campanha fica no navegador por até 30 dias. A escolha do aviso de cookies permanece até você alterá-la em Preferências de cookies, no rodapé.",
    ],
  },
  {
    title: "Seus direitos",
    body: [
      "Você pode pedir confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre com quem compartilhamos, informação sobre a possibilidade de não consentir e revogação do consentimento (art. 18). A revogação é gratuita e não prejudica o que já foi tratado de forma lícita.",
      `Escreva para ${contact.email} ou ligue para ${contact.phoneDisplay}. Se não for possível atender de imediato, a resposta indica o motivo (art. 18, § 4º).`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="border-b border-line bg-white text-ink">
        <div className="container-page flex h-16 items-center justify-between lg:h-[4.5rem]">
          <Link href="/" aria-label="Fechou Tributo — página inicial">
            <Logo />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-[0.9375rem] text-ink/75 hover:text-ink">
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Voltar
          </Link>
        </div>
      </header>

      <main id="conteudo" className="bg-white py-20 sm:py-28">
        <article className="container-page max-w-[48rem]">
          <h1 className="text-section">Política de Privacidade</h1>
          <p className="text-lead mt-6 text-muted">
            Esta política explica como a Fechou Tributo trata os dados enviados pela página de contabilidade para
            médicos.
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
