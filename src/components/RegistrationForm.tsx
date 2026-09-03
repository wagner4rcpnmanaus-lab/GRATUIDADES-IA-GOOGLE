import { useEffect, useState, type ReactNode } from "react";
import type { FormErrors, FormState, Registration } from "../types";
import {
  ESCREVENTES,
  MOTIVOS,
  OUTRO_ESCREVENTE,
  SEM_CONTATO,
  TIPOS_CERTIDAO,
} from "../constants";
import {
  isValidEmail,
  isValidPhone,
  maskPhone,
  normalizeEmail,
} from "../utils/masks";
import { normalizeEscrevente, todayISO } from "../utils/helpers";
import { cn } from "../utils/cn";
import {
  AlertIcon,
  CalendarIcon,
  CheckIcon,
  ClipboardListIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  ScaleIcon,
  TagIcon,
  UserIcon,
} from "./icons";

const CONCLUSAO_ATALHOS = [
  "Certidão eletrônica enviada por Whatsapp em ",
  "Certidão eletrônica enviada por E-mail em ",
  "Certidão Física expedida em ",
];

interface FormShape extends FormState {
  escreventeOutro: string;
}

interface Props {
  editing: Registration | null;
  onSubmit: (data: FormState) => void;
  onCancelEdit: () => void;
}

const EMPTY: FormShape = {
  escrevente: "",
  escreventeOutro: "",
  motivo: "",
  tipoCertidao: "",
  parteInteressada: "",
  telefone: "",
  email: "",
  data: todayISO(),
  observacoes: "",
  naoAtendido: false,
};

function fromRegistration(r: Registration): FormShape {
  const normalizedEscrevente = normalizeEscrevente(r.escrevente);
  const isKnownEscrevente = (ESCREVENTES as readonly string[]).includes(
    normalizedEscrevente,
  );
  return {
    escrevente: isKnownEscrevente ? normalizedEscrevente : OUTRO_ESCREVENTE,
    escreventeOutro: isKnownEscrevente ? "" : normalizedEscrevente,
    parteInteressada: r.parteInteressada.toLocaleUpperCase("pt-BR"),
    telefone: r.telefone,
    email: r.email,
    data: r.data,
    observacoes: r.observacoes ?? "",
    naoAtendido: r.naoAtendido ?? false,
    motivo: r.motivo,
    tipoCertidao: r.tipoCertidao ?? "",
  };
}

function validate(form: FormShape): FormErrors {
  const e: FormErrors = {};
  if (!form.escrevente) e.escrevente = "Selecione o escrevente responsável.";
  else if (
    form.escrevente === OUTRO_ESCREVENTE &&
    !form.escreventeOutro.trim()
  ) {
    e.escrevente = "Informe o nome do escrevente.";
  }
  if (!form.parteInteressada.trim()) e.parteInteressada = "Informe a parte interessada.";
  else if (form.parteInteressada.trim().length < 3)
    e.parteInteressada = "Informe um nome válido.";
  if (form.telefone !== SEM_CONTATO && !isValidPhone(form.telefone))
    e.telefone = "Telefone inválido (DDD + número).";
  if (form.email !== SEM_CONTATO && !isValidEmail(form.email))
    e.email = "Informe um e-mail válido.";
  if (!form.motivo.trim()) e.motivo = "Informe o motivo da gratuidade.";
  if (!form.tipoCertidao) e.tipoCertidao = "Selecione o tipo de certidão.";
  if (!form.data) e.data = "Informe a data do atendimento.";
  return e;
}

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  action,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-[#fff6e6]/84"
        >
          {label}
          {required && <span className="ml-0.5 text-[#d7ad63]">*</span>}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-300">
          <AlertIcon className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-[#fff6e6]/38">{hint}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  "brand-control py-2.5 text-sm shadow-sm";

export default function RegistrationForm({
  editing,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<FormShape>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setForm(editing ? fromRegistration(editing) : EMPTY);
    setErrors({});
    setTouched(false);
  }, [editing]);

  const set = <K extends keyof FormShape>(key: K, value: FormShape[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (touched) setErrors(validate(next));
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const finalEscrevente =
      form.escrevente === OUTRO_ESCREVENTE
        ? form.escreventeOutro.trim()
        : normalizeEscrevente(form.escrevente);

    onSubmit({
      escrevente: finalEscrevente,
      motivo: form.motivo.trim(),
      tipoCertidao: form.tipoCertidao,
      parteInteressada: form.parteInteressada.trim().toLocaleUpperCase("pt-BR"),
      telefone: form.telefone,
      email: form.email,
      data: form.data,
      observacoes: (form.observacoes ?? "").trim() || undefined,
      naoAtendido: form.naoAtendido ?? false,
    });

    setForm(EMPTY);
    setErrors({});
    setTouched(false);
  };

  const handleReset = () => {
    if (editing) {
      onCancelEdit();
    } else {
      setForm(EMPTY);
      setErrors({});
      setTouched(false);
    }
  };

  const noPhone = form.telefone === SEM_CONTATO;
  const noEmail = form.email === SEM_CONTATO;
  const emailValid =
    !noEmail && form.email.length > 0 && isValidEmail(form.email);

  const setObservacaoAtalho = (atalho: string) => {
    set("observacoes", atalho);
  };

  return (
    <section className={cn(editing && "rounded-[1.75rem] ring-2 ring-[#d7ad63]/70")}>
      <div className="lux-panel overflow-hidden rounded-[1.75rem]">
        {/* Cabeçalho do formulário */}
        <div className="flex items-center gap-3 border-b border-[#d7ad63]/14 bg-white/[0.03] px-5 py-4">
          <div className="gold-surface flex h-10 w-10 items-center justify-center rounded-xl text-[#171b22] shadow-[0_14px_30px_rgba(155,111,44,0.22)]">
            {editing ? (
              <PencilIcon className="h-5 w-5" />
            ) : (
              <ClipboardListIcon className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-lg font-semibold uppercase tracking-[0.16em] text-[#fff6e6]">
              {editing ? "EDITAR CADASTRO" : "NOVO CADASTRO"}
            </h2>
            <p className="mt-0.5 text-xs text-[#fff6e6]/48">
              {editing
                ? `Protocolo ${editing.protocolo}`
                : "Preencha os dados da gratuidade atendida"}
            </p>
          </div>
          {editing && (
            <span className="rounded-full border border-[#d7ad63]/30 bg-[#d7ad63]/12 px-2.5 py-1 text-xs font-semibold text-[#f0d59b]">
              Em edição
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
          {/* Escrevente */}
          <Field
            label="Nome do escrevente"
            htmlFor="escrevente"
            required
            error={errors.escrevente}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
                <UserIcon className="h-4.5 w-4.5" />
              </span>
              <select
                id="escrevente"
                value={form.escrevente}
                onChange={(e) => {
                  set("escrevente", e.target.value);
                  if (e.target.value !== OUTRO_ESCREVENTE) {
                    set("escreventeOutro", "");
                  }
                }}
                className={cn(
                  inputBase,
                  "appearance-none pl-10 pr-9",
                  form.escrevente ? "" : "text-[#fff6e6]/42",
                  errors.escrevente
                    ? "border-rose-400 focus:border-rose-300"
                    : "",
                )}
              >
                <option value="" disabled>
                  Selecione o escrevente…
                </option>
                {ESCREVENTES.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
                <option value={OUTRO_ESCREVENTE}>
                  {OUTRO_ESCREVENTE}
                </option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            {form.escrevente === OUTRO_ESCREVENTE && (
              <div className="animate-card mt-2">
                <input
                  id="escreventeOutro"
                  type="text"
                  autoComplete="off"
                  placeholder="Digite o nome do escrevente"
                  value={form.escreventeOutro}
                  onChange={(e) => set("escreventeOutro", e.target.value)}
                  className={cn(
                    inputBase,
                    "px-3",
                  )}
                />
              </div>
            )}
          </Field>

          {/* Parte interessada */}
          <Field
            label="Parte interessada"
            htmlFor="parte"
            required
            error={errors.parteInteressada}
            hint="Nome do beneficiário, empresa ou representante"
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
                <ScaleIcon className="h-4.5 w-4.5" />
              </span>
              <input
                id="parte"
                type="text"
                autoComplete="off"
                placeholder="Ex.: JOÃO DA SILVA / EMPRESA XYZ LTDA"
                value={form.parteInteressada}
                onChange={(e) =>
                  set(
                    "parteInteressada",
                    e.target.value.toLocaleUpperCase("pt-BR"),
                  )
                }
                className={cn(
                  inputBase,
                  "pl-10",
                  errors.parteInteressada
                    ? "border-rose-400 focus:border-rose-300"
                    : "",
                )}
              />
            </div>
          </Field>

          {/* Contatos */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d59b]/58">
              <PhoneIcon className="h-3.5 w-3.5" />
              Contatos
            </p>
            <div className="space-y-4">
              {/* Telefone */}
              <Field
                label="Telefone"
                htmlFor="telefone"
                required
                error={errors.telefone}
                hint={
                  noPhone
                    ? "Cadastro sem telefone informado"
                    : "(DD) 00000-0000"
                }
                action={
                  <button
                    type="button"
                    onClick={() => set("telefone", noPhone ? "" : SEM_CONTATO)}
                    title="Marcar que a parte não possui telefone"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition hover:-translate-y-px",
                      noPhone
                        ? "border-[#d7ad63] bg-[#d7ad63] text-[#171b22] shadow-sm"
                        : "border-[#d7ad63]/22 bg-white/[0.04] text-[#fff6e6]/55 hover:border-[#d7ad63]/55 hover:text-[#f0d59b]",
                    )}
                  >
                    {noPhone && <CheckIcon className="h-3 w-3" />}
                    Não possui
                  </button>
                }
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
                    <PhoneIcon className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="telefone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="off"
                    disabled={noPhone}
                    placeholder="(11) 99999-9999"
                    value={form.telefone}
                    onChange={(e) => set("telefone", maskPhone(e.target.value))}
                    className={cn(
                      inputBase,
                      "pl-10",
                      errors.telefone && !noPhone
                        ? "border-rose-400 focus:border-rose-300"
                        : "",
                    )}
                  />
                </div>
              </Field>

              {/* E-mail */}
              <Field
                label="E-mail"
                htmlFor="email"
                required
                error={errors.email}
                hint={noEmail ? "Cadastro sem e-mail informado" : undefined}
                action={
                  <button
                    type="button"
                    onClick={() => set("email", noEmail ? "" : SEM_CONTATO)}
                    title="Marcar que a parte não possui e-mail"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition hover:-translate-y-px",
                      noEmail
                        ? "border-[#d7ad63] bg-[#d7ad63] text-[#171b22] shadow-sm"
                        : "border-[#d7ad63]/22 bg-white/[0.04] text-[#fff6e6]/55 hover:border-[#d7ad63]/55 hover:text-[#f0d59b]",
                    )}
                  >
                    {noEmail && <CheckIcon className="h-3 w-3" />}
                    Não possui
                  </button>
                }
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
                    <MailIcon className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="email"
                    type="text"
                    autoComplete="off"
                    disabled={noEmail}
                    placeholder="exemplo@email.com"
                    value={form.email}
                    onChange={(e) => set("email", normalizeEmail(e.target.value))}
                    className={cn(
                      inputBase,
                      "pr-10 pl-10",
                      errors.email && !noEmail
                        ? "border-rose-400 focus:border-rose-300"
                        : emailValid
                          ? "border-emerald-400 focus:border-emerald-300"
                          : "",
                    )}
                  />
                  {emailValid && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </Field>
            </div>
          </div>

          {/* Motivo */}
          <Field
            label="Motivo da gratuidade"
            htmlFor="motivo"
            required
            error={errors.motivo}
          >
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {MOTIVOS.map((atalho) => (
                  <button
                    key={atalho}
                    type="button"
                    onClick={() => set("motivo", `${atalho} `)}
                    className="shortcut-button rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition"
                  >
                    {atalho}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
                  <TagIcon className="h-4.5 w-4.5" />
                </span>
                <input
                id="motivo"
                type="text"
                autoComplete="off"
                value={form.motivo}
                onChange={(e) => set("motivo", e.target.value)}
                placeholder="Escolha um atalho e complete a informação"
                className={cn(
                  inputBase,
                  "pl-10 pr-3",
                  errors.motivo
                    ? "border-rose-400 focus:border-rose-300"
                    : "",
                )}
                />
              </div>
            </div>
          </Field>

          <Field
            label="Tipo de certidão"
            htmlFor="tipoCertidao"
            required
            error={errors.tipoCertidao}
          >
            <div className="grid grid-cols-2 gap-2">
              {TIPOS_CERTIDAO.map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => set("tipoCertidao", tipo)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition duration-200",
                    form.tipoCertidao === tipo
                      ? "border-[#d7ad63] bg-[#d7ad63]/16 text-[#f0d59b] ring-2 ring-[#d7ad63]/12"
                      : "border-[#d7ad63]/22 bg-white/[0.035] text-[#fff6e6]/62 hover:border-[#d7ad63]/50 hover:bg-white/[0.06] hover:text-[#f0d59b]",
                  )}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </Field>

          {/* Data e observações em sequência */}
          <div className="space-y-4">
            <Field
              label="Data do atendimento"
              htmlFor="data"
              required
              error={errors.data}
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
                  <CalendarIcon className="h-4.5 w-4.5" />
                </span>
                <input
                  id="data"
                  type="date"
                  max={todayISO()}
                  value={form.data}
                  onChange={(e) => set("data", e.target.value)}
                  className={cn(
                    inputBase,
                    "pl-10",
                    errors.data
                      ? "border-rose-400 focus:border-rose-300"
                      : "",
                  )}
                />
              </div>
            </Field>
            <Field label="Observações" htmlFor="obs" hint="Opcional">
              <input
                id="obs"
                type="text"
                autoComplete="off"
                placeholder="Anotações adicionais"
                value={form.observacoes ?? ""}
                onChange={(e) => set("observacoes", e.target.value)}
                className={cn(
                  inputBase,
                  "px-3",
                )}
              />
            </Field>
            {editing && (
              <div className="animate-card space-y-2 rounded-2xl border border-emerald-400/24 bg-emerald-400/8 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  Atalhos de conclusão
                </p>
                <div className="grid gap-1.5">
                  {CONCLUSAO_ATALHOS.map((atalho) => (
                    <button
                      key={atalho}
                      type="button"
                      onClick={() => setObservacaoAtalho(atalho)}
                      className="rounded-xl border border-emerald-300/24 bg-white/[0.04] px-2.5 py-2 text-left text-xs font-semibold text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-300/12"
                    >
                      {atalho}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {editing && (
            <div className="animate-card rounded-2xl border border-rose-400/24 bg-rose-500/10 p-3">
              <label className="flex cursor-pointer items-start gap-3" htmlFor="naoAtendido">
                <input
                  id="naoAtendido"
                  type="checkbox"
                  checked={form.naoAtendido ?? false}
                  onChange={(e) => set("naoAtendido", e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-rose-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-rose-100">
                    Marcar pedido como NÃO ATENDIDO
                  </span>
                  <span className="mt-0.5 block text-xs text-rose-200/78">
                    Use quando o pedido foi encerrado sem o envio ou a expedição da certidão.
                  </span>
                </span>
              </label>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="lux-button-primary inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] transition active:scale-[0.99]"
            >
              {editing ? (
                <>
                  <CheckIcon className="h-4.5 w-4.5" />
                  Salvar alterações
                </>
              ) : (
                <>
                  <PlusIcon className="h-4.5 w-4.5" />
                  Cadastrar gratuidade
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="lux-button-secondary inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] transition"
            >
              {editing ? "Cancelar" : "Limpar"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
