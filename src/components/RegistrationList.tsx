import { useMemo, useState } from "react";
import type { Registration } from "../types";
import { ESCREVENTES, SEM_CONTATO } from "../constants";
import { formatDateBR, getInitials, isConcluido } from "../utils/helpers";
import { cn } from "../utils/cn";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  PrinterIcon,
  SearchIcon,
  TagIcon,
  TrashIcon,
  UserIcon,
} from "./icons";

interface Props {
  registrations: Registration[];
  onEdit: (reg: Registration) => void;
  onRequestDelete: (reg: Registration) => void;
}



function RegistrationCard({
  reg,
  onEdit,
  onRequestDelete,
}: {
  reg: Registration;
  onEdit: (reg: Registration) => void;
  onRequestDelete: (reg: Registration) => void;
}) {
  const concluido = isConcluido(reg);
  const naoAtendido = reg.naoAtendido === true;

  return (
    <article
      className={cn(
        "animate-card group relative overflow-hidden rounded-2xl border p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 sm:p-5",
        naoAtendido
          ? "border-rose-500/58 bg-rose-950/34 hover:border-rose-400"
          : concluido
            ? "border-emerald-400/58 bg-emerald-950/28 hover:border-emerald-300"
            : "border-[#d7ad63]/18 bg-[#1f2631]/78 hover:border-[#d7ad63]/44",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7ad63]/55 to-transparent" />
      <div className="flex items-start gap-4">
        <div className="gold-surface flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-serif text-sm font-bold text-[#171b22] shadow-[0_14px_34px_rgba(155,111,44,0.26)]">
          {getInitials(reg.parteInteressada)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <div className="min-w-0">
              <h3 className="truncate font-serif text-lg font-semibold uppercase tracking-[0.06em] text-[#fff6e6]">
                {reg.parteInteressada}
              </h3>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#fff6e6]/44">
                <span className="font-medium text-[#f0d59b]/82" title="Protocolo">
                  Protocolo: <span className="font-mono">{reg.protocolo}</span>
                </span>
                <span className="text-[#d7ad63]/28">•</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-[#d7ad63]/58" />
                  {formatDateBR(reg.data)}
                </span>
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {concluido && (
                <span className="mr-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/18 px-2.5 py-1 text-xs font-bold text-emerald-100 ring-1 ring-emerald-300/25">
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  Concluído
                </span>
              )}
              {naoAtendido && (
                <span className="mr-1 inline-flex items-center rounded-full bg-rose-600/88 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  NÃO ATENDIDO
                </span>
              )}
              <div className="no-print flex gap-1 opacity-100 sm:opacity-65 sm:transition sm:group-hover:opacity-100">
                <button
                  onClick={() => onEdit(reg)}
                  className="rounded-xl border border-[#d7ad63]/18 bg-white/[0.04] p-2 text-[#f0d59b]/76 transition hover:border-[#d7ad63]/45 hover:bg-[#d7ad63]/10 hover:text-[#f0d59b]"
                  aria-label="Editar"
                  title="Editar"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onRequestDelete(reg)}
                  className="rounded-xl border border-rose-300/14 bg-white/[0.04] p-2 text-rose-200/70 transition hover:border-rose-300/45 hover:bg-rose-500/10 hover:text-rose-100"
                  aria-label="Excluir"
                  title="Excluir"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#d7ad63]/16 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-[#fff6e6]/72">
              <UserIcon className="h-3.5 w-3.5 text-[#d7ad63]/62" />
              {reg.escrevente}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#d7ad63]/22 bg-[#d7ad63]/8 px-2.5 py-1 text-xs font-medium text-[#f0d59b]">
              <TagIcon className="h-3.5 w-3.5" />
              {reg.motivo}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-300/18 bg-sky-400/8 px-2.5 py-1 text-xs font-medium text-sky-100">
              <span aria-hidden="true">
                {reg.tipoCertidao === "Certidão Eletrônica"
                  ? "💻"
                  : reg.tipoCertidao === "Certidão Física"
                    ? "📄"
                    : "❔"}
              </span>
              {reg.tipoCertidao || "Tipo não informado"}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-1.5 border-t border-[#d7ad63]/12 pt-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
            {reg.telefone === SEM_CONTATO ? (
              <span className="inline-flex items-center gap-2 text-[#fff6e6]/38">
                <PhoneIcon className="h-4 w-4" />
                <span className="italic">Não possui telefone</span>
              </span>
            ) : (
              <a
                href={`tel:${reg.telefone.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-2 text-[#fff6e6]/68 transition hover:text-[#f0d59b]"
              >
                <PhoneIcon className="h-4 w-4 text-[#d7ad63]/58" />
                {reg.telefone}
              </a>
            )}
            {reg.email === SEM_CONTATO ? (
              <span className="inline-flex items-center gap-2 text-[#fff6e6]/38">
                <MailIcon className="h-4 w-4" />
                <span className="italic">Não possui e-mail</span>
              </span>
            ) : (
              <a
                href={`mailto:${reg.email}`}
                className="inline-flex items-center gap-2 truncate text-[#fff6e6]/68 transition hover:text-[#f0d59b]"
              >
                <MailIcon className="h-4 w-4 shrink-0 text-[#d7ad63]/58" />
                <span className="truncate">{reg.email}</span>
              </a>
            )}
          </div>

          {reg.observacoes && (
            <p className="mt-3 rounded-xl border border-[#d7ad63]/14 bg-black/14 px-3 py-2 text-xs text-[#fff6e6]/58">
              <span className="font-semibold text-[#f0d59b]/78">Observação: </span>
              {reg.observacoes}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function RegistrationList({
  registrations,
  onEdit,
  onRequestDelete,
}: Props) {
  const [query, setQuery] = useState("");
  const [escrevente, setEscrevente] = useState("");
  const [data, setData] = useState("");
  const [telefone, setTelefone] = useState("");

  const hasFilters =
    query.trim() !== "" || escrevente !== "" || data !== "" || telefone !== "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = registrations.filter((r) => {
      if (escrevente && r.escrevente !== escrevente) return false;
      if (data && r.data !== data) return false;
      const phoneDigits = telefone.replace(/\D/g, "");
      if (phoneDigits && !r.telefone.replace(/\D/g, "").includes(phoneDigits)) return false;
      if (!q) return true;
      return [r.parteInteressada, r.escrevente, r.email, r.motivo, r.protocolo]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    list = [...list].sort((a, b) => {
      // Ordenação prioritária por protocolo dependendo de filtros estarem ativos ou não
      if (hasFilters) {
        // Ordena por protocolo, do menor para o maior (001 -> 002 -> 003...)
        // Em caso de empate de protocolo (dias diferentes), ordena por data crescente
        const dataCompare = a.data.localeCompare(b.data);
        if (dataCompare !== 0) return dataCompare;
        return a.protocolo.localeCompare(b.protocolo);
      } else {
        // Ordena por protocolo, do maior para o menor (003 -> 002 -> 001...)
        // Em caso de empate de protocolo (dias diferentes), ordena por data decrescente
        const dataCompare = b.data.localeCompare(a.data);
        if (dataCompare !== 0) return dataCompare;
        return b.protocolo.localeCompare(a.protocolo);
      }
    });
    return list;
  }, [registrations, query, escrevente, data, telefone, hasFilters]);
  const selectCls = "brand-control appearance-none py-2 pl-3 pr-9 text-sm";
  const chevron = (
    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );

  return (
    <section className="print-area">
      <div className="lux-panel overflow-hidden rounded-[1.75rem]">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#d7ad63]/14 bg-white/[0.03] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="gold-surface flex h-10 w-10 items-center justify-center rounded-xl text-[#171b22] shadow-[0_14px_30px_rgba(155,111,44,0.22)]">
              <ClipboardListIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold uppercase tracking-[0.16em] text-[#fff6e6]">
                CADASTROS REALIZADOS
              </h2>
              <p className="mt-0.5 text-xs text-[#fff6e6]/48">
                {filtered.length} de {registrations.length} {registrations.length === 1 ? "registro" : "registros"}
              </p>
            </div>
          </div>

          <div className="no-print ml-auto flex gap-2">
            <button
              onClick={() => window.print()}
              disabled={registrations.length === 0}
              className="lux-button-secondary inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PrinterIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        <div className="no-print space-y-3 border-b border-[#d7ad63]/12 p-4">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d7ad63]/58">
              <SearchIcon className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por parte, escrevente, e-mail, motivo..."
              className="brand-control py-2 pl-10 pr-9 text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#fff6e6]/42 hover:text-[#f0d59b]"
                aria-label="Limpar busca"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d7ad63]/58" />
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                aria-label="Pesquisar por data"
                className="brand-control py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <div className="relative">
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d7ad63]/58" />
              <input
                type="tel"
                inputMode="numeric"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Pesquisar telefone"
                className="brand-control py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <div className="relative">
              <select
                value={escrevente}
                onChange={(e) => setEscrevente(e.target.value)}
                className={cn(selectCls, !escrevente && "text-[#fff6e6]/42")}
              >
                <option value="">Todos escreventes</option>
                {ESCREVENTES.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </select>
              {chevron}
            </div>
            <div className="relative">
              <div className="brand-control py-2 px-3 text-sm text-[#fff6e6]/62">
                Ordenado por protocolo
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-area max-h-[70vh] space-y-3 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="gold-surface flex h-16 w-16 items-center justify-center rounded-2xl text-[#171b22] opacity-85">
                <ClipboardListIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-[#fff6e6]">
                {hasFilters ? "Nenhum resultado encontrado" : "Nenhum cadastro ainda"}
              </h3>
              <p className="mt-1 max-w-xs text-sm text-[#fff6e6]/50">
                {hasFilters
                  ? "Tente ajustar a busca ou os filtros aplicados."
                  : "Os atendimentos de gratuidade cadastrados aparecerão aqui."}
              </p>
              {hasFilters && (
                <button
                  onClick={() => {
                    setQuery("");
                    setEscrevente("");
                    setData("");
                    setTelefone("");
                  }}
                  className="lux-button-secondary mt-4 rounded-xl px-4 py-2 text-sm font-semibold transition"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            filtered.map((reg) => (
              <RegistrationCard
                key={reg.id}
                reg={reg}
                onEdit={onEdit}
                onRequestDelete={onRequestDelete}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}