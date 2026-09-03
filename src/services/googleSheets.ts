import type { Registration } from "../types";
import { generateId, normalizeEscrevente, todayISO } from "../utils/helpers";

export const SHEET_ID = "16nPjDWqQktXvrxK6RsK4VBuDNOXN81wTNGgjYNSRiec";
export const SHEET_EDIT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

/**
 * O Google Sheets converte automaticamente "001" em número (1)
 * e "2026-08-18" em objeto de data (ISO). Normalizamos na leitura
 * para manter o formato usado pelo sistema.
 */
function normalizeProtocolo(value: unknown): string {
  const s = String(value ?? "").trim();
  if (s === "") return "001";
  if (/^\d+$/.test(s)) return s.padStart(3, "0");
  return s;
}

function normalizeData(value: unknown): string {
  const s = String(value ?? "").trim();
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return s || todayISO();
}

export function normalizeSheetRecord(
  raw: Record<string, unknown>,
): Registration {
  const now = Date.now();
  return {
    id: String(raw.id ?? "") || generateId(),
    protocolo: normalizeProtocolo(raw.protocolo),
    escrevente: normalizeEscrevente(String(raw.escrevente ?? "")),
    motivo: String(raw.motivo ?? ""),
    tipoCertidao: String(raw.tipoCertidao ?? ""),
    parteInteressada: String(raw.parteInteressada ?? "").toLocaleUpperCase("pt-BR"),
    telefone: String(raw.telefone ?? ""),
    email: String(raw.email ?? ""),
    data: normalizeData(raw.data),
    observacoes: String(raw.observacoes ?? ""),
    naoAtendido: String(raw.naoAtendido).toLowerCase() === "true",
    createdAt: Number(raw.createdAt) || now,
    updatedAt: Number(raw.updatedAt) || now,
  };
}

export async function fetchSheetRecords(
  endpoint: string,
): Promise<Registration[]> {
  const url = new URL(endpoint);
  url.searchParams.set("action", "list");
  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) throw new Error("Não foi possível ler a planilha.");
  const data = await response.json();
  const records = Array.isArray(data.records) ? data.records : [];
  return records.map(normalizeSheetRecord);
}

export async function replaceSheetRecords(
  endpoint: string,
  records: Registration[],
): Promise<void> {
  // Sem Content-Type JSON de propósito: evita o preflight CORS,
  // que o Apps Script não responde. O corpo chega como text/plain.
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({ action: "replaceAll", records }),
  });
  if (!response.ok) throw new Error("Não foi possível atualizar a planilha.");
}

export function recordsHash(records: Registration[]): string {
  return JSON.stringify(
    [...records].sort((a, b) => a.id.localeCompare(b.id)),
  );
}
