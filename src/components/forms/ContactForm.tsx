"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Field, FieldError, Input, Select, Textarea, describedBy } from "@/components/ui/Field";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/config/site";
import { getAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/events";
import { PREFILL_EVENT, type LeadPrefill } from "@/lib/lead-prefill";
import { formatBrazilianPhone } from "@/lib/utils";
import { UFS, leadFormSchema, type LeadFormInput, type LeadFormValues } from "@/lib/validations/lead-schema";
import { leadWhatsappMessage } from "@/lib/whatsapp/integration";
import { OBJECTIVES, REVENUE_RANGES } from "@/types/lead";
import { FormSuccess } from "./FormSuccess";

const SPECIALTIES = [
  "Anestesiologia", "Cardiologia", "Cirurgia Geral", "Cirurgia Plástica", "Clínica Médica", "Dermatologia",
  "Endocrinologia", "Gastroenterologia", "Geriatria", "Ginecologia e Obstetrícia", "Medicina de Família e Comunidade",
  "Medicina do Trabalho", "Medicina Intensiva", "Nefrologia", "Neurologia", "Oftalmologia", "Oncologia Clínica",
  "Ortopedia e Traumatologia", "Otorrinolaringologia", "Pediatria", "Pneumologia", "Psiquiatria",
  "Radiologia e Diagnóstico por Imagem", "Reumatologia", "Urologia",
];

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16),
      );
}

type Outcome =
  | { kind: "success"; nome: string; message: string; leadId: string }
  | { kind: "error"; text: string; message: string };

export function ContactForm() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormInput, unknown, LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onTouched",
    defaultValues: {
      nome: "", whatsapp: "", email: "", especialidade: "", cidade: "", uf: undefined,
      possuiCnpj: undefined, objetivo: undefined, faturamento: "", observacoes: "", consentimento: undefined,
    },
  });

  const [outcome, setOutcome] = useState<Outcome | null>(null);
  // Criada na primeira interação: a chave evita lead duplicado em reenvios e o horário alimenta o anti-spam.
  const [session, setSession] = useState<{ key: string; startedAt: number } | null>(null);

  function beginSession() {
    if (!session) setSession({ key: newKey(), startedAt: Date.now() });
    track("form_start");
  }

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { possuiCnpj, objetivo } = (e as CustomEvent<LeadPrefill>).detail;
      setOutcome(null);
      if (possuiCnpj) setValue("possuiCnpj", possuiCnpj, { shouldDirty: true, shouldValidate: true });
      if (objetivo) setValue("objetivo", objetivo, { shouldDirty: true, shouldValidate: true });
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [setValue]);

  async function onSubmit(values: LeadFormValues, event?: React.BaseSyntheticEvent) {
    const form = event?.target instanceof HTMLFormElement ? event.target : null;
    const website = form ? String(new FormData(form).get("website") ?? "") : "";
    const message = leadWhatsappMessage(values);
    const current = session ?? { key: newKey(), startedAt: 0 };
    if (!session) setSession(current);
    track("form_submit", { objetivo: values.objetivo, possui_cnpj: values.possuiCnpj });

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: values,
          attribution: getAttribution(),
          idempotencyKey: current.key,
          startedAt: current.startedAt,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        leadId?: string;
        error?: string;
        issues?: { path: string; message: string }[];
      };

      if (res.ok && data.ok) {
        const leadId = data.leadId ?? current.key;
        track("lead_generated", { objetivo: values.objetivo, possui_cnpj: values.possuiCnpj }, leadId);
        setOutcome({ kind: "success", nome: values.nome, message, leadId });
        setSession(null);
        return;
      }

      if (res.status === 400 && data.issues?.length) {
        for (const issue of data.issues) {
          const field = issue.path.replace(/^lead\./, "") as keyof LeadFormInput;
          if (field in values) setError(field, { message: issue.message }, { shouldFocus: true });
        }
        return;
      }

      setOutcome({ kind: "error", text: data.error ?? "Não conseguimos enviar agora. Tente novamente em instantes.", message });
    } catch {
      setOutcome({
        kind: "error",
        text: "Sem conexão com o servidor. Verifique sua internet e tente novamente, ou fale conosco pelo WhatsApp.",
        message,
      });
    }
  }

  if (outcome?.kind === "success") {
    return <FormSuccess nome={outcome.nome} whatsappMessage={outcome.message} />;
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={beginSession}
      aria-describedby="form-obrigatorios"
      className="relative grid gap-6 sm:grid-cols-2"
    >
      <p id="form-obrigatorios" className="text-sm text-muted sm:col-span-2">
        Todos os campos são obrigatórios, exceto quando indicado.
      </p>

      <Field id="nome" label="Nome completo" error={errors.nome?.message} className="sm:col-span-2">
        <Input
          id="nome"
          autoComplete="name"
          aria-invalid={!!errors.nome}
          aria-describedby={describedBy("nome", errors.nome?.message)}
          {...register("nome")}
        />
      </Field>

      <Field id="whatsapp" label="WhatsApp com DDD" error={errors.whatsapp?.message}>
        <Input
          id="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(31) 99999-9999"
          maxLength={15}
          aria-invalid={!!errors.whatsapp}
          aria-describedby={describedBy("whatsapp", errors.whatsapp?.message)}
          {...register("whatsapp")}
          onChange={(e) => {
            e.target.value = formatBrazilianPhone(e.target.value);
            return register("whatsapp").onChange(e);
          }}
        />
      </Field>

      <Field id="email" label="E-mail profissional" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          autoCapitalize="none"
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email", errors.email?.message)}
          {...register("email")}
        />
      </Field>

      <Field id="especialidade" label="Especialidade médica" error={errors.especialidade?.message} className="sm:col-span-2">
        <Input
          id="especialidade"
          list="especialidades"
          autoComplete="off"
          placeholder="Ex.: Cardiologia"
          aria-invalid={!!errors.especialidade}
          aria-describedby={describedBy("especialidade", errors.especialidade?.message)}
          {...register("especialidade")}
        />
        <datalist id="especialidades">
          {SPECIALTIES.map((s) => <option key={s} value={s} />)}
        </datalist>
      </Field>

      <div className="grid grid-cols-[1fr_6.5rem] gap-3 sm:col-span-2 sm:grid-cols-[1fr_8rem] sm:gap-6">
        <Field id="cidade" label="Cidade" error={errors.cidade?.message}>
          <Input
            id="cidade"
            autoComplete="address-level2"
            aria-invalid={!!errors.cidade}
            aria-describedby={describedBy("cidade", errors.cidade?.message)}
            {...register("cidade")}
          />
        </Field>
        <Field id="uf" label="Estado" error={errors.uf?.message}>
          <Select
            id="uf"
            autoComplete="address-level1"
            aria-invalid={!!errors.uf}
            aria-describedby={describedBy("uf", errors.uf?.message)}
            defaultValue=""
            {...register("uf")}
          >
            <option value="" disabled>UF</option>
            {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </Select>
        </Field>
      </div>

      <fieldset className="sm:col-span-2">
        <legend id="possuiCnpj-label" className="mb-2 text-[0.9375rem] font-medium text-graphite">Você já possui CNPJ?</legend>
        <div
          role="radiogroup"
          aria-labelledby="possuiCnpj-label"
          aria-invalid={!!errors.possuiCnpj}
          aria-describedby={errors.possuiCnpj ? "possuiCnpj-error" : undefined}
          className="grid grid-cols-2 gap-3"
        >
          {(["sim", "nao"] as const).map((value) => (
            <label
              key={value}
              className="relative flex h-[3.25rem] cursor-pointer items-center justify-center rounded-xl border border-line bg-mist/60 text-base text-graphite transition-colors duration-200 hover:border-ink/30 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-ink"
            >
              <input
                type="radio"
                value={value}
                className="sr-only"
                {...register("possuiCnpj", {
                  onChange: () => track("select_cnpj_status", { cnpj_status: value, origin: "formulario" }),
                })}
              />
              {value === "sim" ? "Sim" : "Não"}
            </label>
          ))}
        </div>
        <FieldError id="possuiCnpj-error" message={errors.possuiCnpj?.message} />
      </fieldset>

      <Field id="objetivo" label="Qual é o seu principal objetivo?" error={errors.objetivo?.message} className="sm:col-span-2">
        <Select
          id="objetivo"
          aria-invalid={!!errors.objetivo}
          aria-describedby={describedBy("objetivo", errors.objetivo?.message)}
          defaultValue=""
          {...register("objetivo")}
        >
          <option value="" disabled>Selecione uma opção</option>
          {Object.entries(OBJECTIVES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </Field>

      <Field id="faturamento" label="Faturamento mensal aproximado" optional error={errors.faturamento?.message} className="sm:col-span-2">
        <Select id="faturamento" defaultValue="" {...register("faturamento")}>
          <option value="">Selecione uma faixa</option>
          {Object.entries(REVENUE_RANGES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </Field>

      <Field
        id="observacoes"
        label="Observações"
        optional
        hint="Conte brevemente sua situação. Não inclua dados de pacientes."
        error={errors.observacoes?.message}
        className="sm:col-span-2"
      >
        <Textarea
          id="observacoes"
          rows={3}
          maxLength={1000}
          aria-invalid={!!errors.observacoes}
          aria-describedby={describedBy("observacoes", errors.observacoes?.message, "hint")}
          {...register("observacoes")}
        />
      </Field>

      {/* Campo armadilha para robôs: invisível para pessoas e leitores de tela. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-relaxed text-graphite">
          <input
            type="checkbox"
            className="mt-1 size-5 shrink-0 cursor-pointer rounded-[3px] accent-ink"
            aria-invalid={!!errors.consentimento}
            aria-describedby={errors.consentimento ? "consentimento-error" : undefined}
            {...register("consentimento")}
          />
          <span>
            Autorizo a Fechou Tributo a usar estes dados só para entrar em contato e apresentar os serviços de
            contabilidade. Posso revogar essa autorização a qualquer momento, sem custo, pelo e-mail{" "}
            {siteConfig.contact.email}, conforme a{" "}
            <a href="/politica-de-privacidade" target="_blank" className="font-medium text-ink underline">
              Política de Privacidade
              <span className="sr-only"> (abre em uma nova aba)</span>
            </a>
            .
          </span>
        </label>
        <FieldError id="consentimento-error" message={errors.consentimento?.message} />
      </div>

      {outcome?.kind === "error" && (
        <div role="alert" className="rounded-2xl border border-[#b42318]/30 bg-[#fef3f2] p-5 sm:col-span-2">
          <p className="text-[0.9375rem] leading-relaxed text-[#7a271a]">{outcome.text}</p>
          <WhatsAppLink
            trackingId="formulario_falha"
            message={outcome.message}
            className={buttonClasses("primary", "md", "mt-4 w-full sm:w-auto")}
          >
            <WhatsAppIcon className="size-[1.125rem]" />
            Enviar meus dados pelo WhatsApp
          </WhatsAppLink>
        </div>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting} aria-disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            "Solicitar análise gratuita"
          )}
        </Button>
        <p aria-live="polite" className="sr-only">{isSubmitting ? "Enviando seus dados" : ""}</p>
      </div>
    </form>
  );
}
