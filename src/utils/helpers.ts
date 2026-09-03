import type { Registration } from "../types";

export function normalizeEscrevente(name: string): string {
  return name.trim() === "Lyciana" ? "Lucyana" : name;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Protocolo diário: reinicia todos os dias em 001. */
export function generateProtocolo(
  existing: Registration[],
  dataAtendimento: string,
): string {
  const sameDay = existing.filter((r) => r.data === dataAtendimento);
  const maxNum = sameDay.reduce((mx, r) => {
    if (!/^\d{3}$/.test(r.protocolo)) return mx;
    return Math.max(mx, Number(r.protocolo));
  }, 0);
  return String(Math.max(sameDay.length, maxNum) + 1).padStart(3, "0");
}

/**
 * Renumera os protocolos de cada dia em sequência (001, 002, ...),
 * na ordem de criação, sem deixar números vagos ou duplicados.
 */
export function renumberProtocols(records: Registration[]): Registration[] {
  const byDay = new Map<string, Registration[]>();
  records.forEach((r) => {
    const list = byDay.get(r.data) ?? [];
    list.push(r);
    byDay.set(r.data, list);
  });
  const protocoloById = new Map<string, string>();
  byDay.forEach((list) => {
    [...list]
      .sort(
        (a, b) =>
          a.createdAt - b.createdAt || a.protocolo.localeCompare(b.protocolo),
      )
      .forEach((r, i) =>
        protocoloById.set(r.id, String(i + 1).padStart(3, "0")),
      );
  });
  return records.map((r) => ({
    ...r,
    protocolo: protocoloById.get(r.id) ?? r.protocolo,
  }));
}

export function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

/** Retorna a data ISO de N dias atrás. */
export function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function formatDateBR(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function formatDateLong(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isConcluido(reg: Registration): boolean {
  if (reg.naoAtendido) return false;
  const conteudo = [reg.motivo, reg.observacoes ?? ""]
    .join(" ")
    .toLocaleLowerCase("pt-BR");
  return (
    conteudo.includes("certidão enviada") ||
    conteudo.includes("certidão expedida") ||
    /certid[aã]o.*(enviada|expedida)/.test(conteudo)
  );
}

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-indigo-100 text-indigo-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-cyan-100 text-cyan-700",
];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function exportCSV(regs: Registration[]): void {
  const headers = [
    "Protocolo",
    "Data",
    "Escrevente",
    "Parte Interessada",
    "Motivo da Gratuidade",
    "Tipo de Certidão",
    "Telefone",
    "E-mail",
    "Observações",
  ];
  const rows = regs.map((r) => [
    r.protocolo,
    formatDateBR(r.data),
    r.escrevente,
    r.parteInteressada,
    r.motivo,
    r.tipoCertidao || "Não informado",
    r.telefone,
    r.email,
    r.observacoes ?? "",
  ]);
  const escape = (cell: string) => `"${String(cell).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(";")).join("\r\n");
  // BOM para o Excel reconhecer UTF-8
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gratuidades-${todayISO()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
