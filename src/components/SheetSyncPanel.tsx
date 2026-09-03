import { useState } from "react";
import { SHEET_EDIT_URL, SHEET_ID } from "../services/googleSheets";
import { AlertIcon, CheckCircleIcon } from "./icons";
import { cn } from "../utils/cn";

interface Props {
  endpoint: string;
  status: "off" | "syncing" | "synced" | "error";
  message: string;
  lastSyncAt: number | null;
  onEndpointChange: (endpoint: string) => void;
  onSyncNow: () => void;
}

const STATUS_LABEL: Record<Props["status"], string> = {
  off: "Desligado",
  syncing: "Sincronizando…",
  synced: "Conectado à planilha",
  error: "Erro de conexão",
};

export default function SheetSyncPanel({
  endpoint,
  status,
  message,
  lastSyncAt,
  onEndpointChange,
  onSyncNow,
}: Props) {
  const [draft, setDraft] = useState(endpoint);

  const tone =
    status === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : status === "synced"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : status === "syncing"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-slate-50 text-slate-500";

  const dot =
    status === "error"
      ? "bg-rose-500"
      : status === "synced"
        ? "bg-emerald-500"
        : status === "syncing"
          ? "animate-pulse bg-amber-500"
          : "bg-slate-400";

  return (
    <section className="no-print mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
        <svg
          className="h-4 w-4 text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9M15 21V9" />
        </svg>
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
          Sincronização · Google Sheets
        </h2>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            tone,
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", dot)} />
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <input
            type="url"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="URL do Web App do Apps Script"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              {status === "error" ? (
                <AlertIcon className="h-3.5 w-3.5 text-rose-500" />
              ) : (
                <CheckCircleIcon
                  className={cn(
                    "h-3.5 w-3.5",
                    status === "synced" ? "text-emerald-500" : "text-slate-400",
                  )}
                />
              )}
              {message}
            </span>
            {lastSyncAt && (
              <span className="text-slate-400">
                Última sincronização às{" "}
                <span className="font-medium text-slate-600">
                  {new Date(lastSyncAt).toLocaleTimeString("pt-BR")}
                </span>
              </span>
            )}
            <a
              href={SHEET_EDIT_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-amber-700 underline decoration-amber-300 underline-offset-2 transition hover:text-amber-800"
              title={SHEET_ID}
            >
              Abrir planilha ↗
            </a>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEndpointChange(draft)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-slate-800 active:translate-y-0"
          >
            Salvar URL
          </button>
          <button
            type="button"
            onClick={onSyncNow}
            disabled={!endpoint || status === "syncing"}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-px hover:bg-slate-50 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Sincronizar agora
          </button>
        </div>
      </div>
    </section>
  );
}
