import { useEffect } from "react";
import { AlertIcon } from "./icons";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-overlay absolute inset-0 bg-[#090d14]/78 backdrop-blur-md"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="animate-modal lux-panel relative w-full max-w-md rounded-[1.75rem] p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/14 text-rose-200 ring-1 ring-rose-300/24">
            <AlertIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg font-semibold text-[#fff6e6]">{title}</h3>
            <p className="mt-1 text-sm text-[#fff6e6]/58">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="lux-button-secondary rounded-xl px-4 py-2 text-sm font-semibold transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl border border-rose-300/30 bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
