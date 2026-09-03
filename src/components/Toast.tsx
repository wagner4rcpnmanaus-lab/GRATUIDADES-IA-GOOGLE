import type { ToastItem } from "../hooks/useToasts";
import { cn } from "../utils/cn";
import { AlertIcon, CheckCircleIcon, InfoIcon, XIcon } from "./icons";

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const STYLES: Record<
  ToastItem["type"],
  { ring: string; icon: string; Icon: typeof InfoIcon }
> = {
  success: { ring: "border-emerald-300/30", icon: "text-emerald-200", Icon: CheckCircleIcon },
  error: { ring: "border-rose-300/30", icon: "text-rose-200", Icon: AlertIcon },
  info: { ring: "border-[#d7ad63]/30", icon: "text-[#f0d59b]", Icon: InfoIcon },
};

export default function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
      {toasts.map((t) => {
        const cfg = STYLES[t.type];
        const { Icon } = cfg;
        return (
          <div
            key={t.id}
            className={cn(
              "animate-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-[#1f2631]/95 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl",
              cfg.ring,
            )}
          >
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", cfg.icon)} />
            <p className="flex-1 text-sm font-medium text-[#fff6e6]/82">{t.message}</p>
            <button
              onClick={() => onDismiss(t.id)}
              className="shrink-0 rounded-md p-0.5 text-[#fff6e6]/42 transition hover:bg-white/8 hover:text-[#f0d59b]"
              aria-label="Fechar"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}