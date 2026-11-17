# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Definido pelo cliente: Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide React, React Hook Form, Zod, Motion. Publicação na Vercel (confirmado).

## Users

Médicos brasileiros que chegam majoritariamente por anúncios no Instagram e Facebook, em celular, entre plantões e consultas. Três situações: ainda não têm CNPJ e querem abrir empresa para exercer a atividade; já têm CNPJ e querem reduzir legalmente a carga tributária; estão insatisfeitos com a contabilidade atual.

## Product Purpose

Landing page comercial da BC Consultores (Botelho e Castro Consultores) para captar leads qualificados de médicos interessados em contabilidade especializada e agendar conversa com um especialista. Sucesso = lead registrado no CRM com origem e campanha identificadas, seguido de contato pelo WhatsApp.

## Positioning

Contabilidade estratégica conduzida por uma consultoria com sede em Belo Horizonte, atuação nacional e um grupo que reúne as frentes contábil, empresarial, consultiva e jurídica (BC Advogados). Atendimento humano, sem robôs.

## Operating Context

- Formulário de conversão envia o lead para o CRM via webhook genérico (CRM ainda não identificado; camada desacoplada por variáveis de ambiente).
- WhatsApp comercial: +55 31 98561-4005 (fonte: site oficial).
- Campanhas pagas com UTMs (Meta e Google).

## Capabilities and Constraints

- Nunca prometer redução garantida de impostos: toda economia depende de análise individual e da legislação aplicável.
- Não solicitar CPF, documentos pessoais ou dados clínicos de pacientes.
- Planos exibidos na hero (R$ 199, R$ 299 e R$ 399/mês por 12 meses) ficam em `src/config/offer.ts` e precisam ser confirmados pela empresa antes da publicação.
- LGPD: consentimento explícito obrigatório no formulário.

## Brand Commitments

- Logo oficial: monograma "BCC" em quadrados + "Botelho e Castro Consultores" em sans geométrica (estilo Futura), branco sobre preto.
- Paleta definida pelo cliente: #101010, #FFFFFF, #242424, #777777, #F3F3F3, bordas #E5E5E5.
- Tom: sofisticação, segurança, autoridade, profissionalismo, tecnologia e confiança. Visual de consultoria premium, editorial e minimalista.

## Evidence on Hand

- Site oficial: https://bcconsultores.adv.br
- Endereço: Rua Buenos Aires, 10 – 12º Andar, Carmo, Belo Horizonte – MG. Telefone (31) 3295-0497. E-mail contabilidade@bcconsultores.adv.br. Seg–Sex, 07:30–18:00.
- Números autorizados pelo cliente: +200 clientes ativos, +15 anos de experiência.
- Fotos reais do escritório (sala de reuniões, recepção) publicadas no site oficial.
- Não existem depoimentos, cases, certificações ou prêmios fornecidos: não inventar.

## Product Principles

1. Clareza antes de persuasão: o médico entende em segundos o que é oferecido e qual o próximo passo.
2. Nenhuma promessa sem lastro: economia sempre condicionada à análise.
3. O lead nunca se perde: o CRM recebe o contato independentemente do WhatsApp.
4. Mobile primeiro: a maioria chega pelo Instagram no celular.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste, foco visível, navegação por teclado, rótulos de formulário e respeito a `prefers-reduced-motion`.
