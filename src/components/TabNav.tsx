import { cn } from "../utils/cn";
import { ClipboardListIcon, PlusIcon } from "./icons";

export type Tab = "novo" | "cadastros";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  total: number;
}

export default function TabNav({ active, onChange, total }: Props) {
  const base =
    "relative inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] transition duration-300 sm:flex-none sm:px-6";

  return (
    <nav className="no-print lux-panel mx-auto flex max-w-3xl flex-col gap-2 rounded-3xl p-2 sm:flex-row">
      <button
        type="button"
        onClick={() => onChange("novo")}
        className={cn(
          base,
          active === "novo"
            ? "lux-button-primary"
            : "text-[#fff6e6]/62 hover:bg-white/5 hover:text-[#f0d59b]",
        )}
      >
        <PlusIcon className="h-4.5 w-4.5" />
        Novo cadastro
      </button>
      <button
        type="button"
        onClick={() => onChange("cadastros")}
        className={cn(
          base,
          active === "cadastros"
            ? "lux-button-primary"
            : "text-[#fff6e6]/62 hover:bg-white/5 hover:text-[#f0d59b]",
        )}
      >
        <ClipboardListIcon className="h-4.5 w-4.5" />
        Cadastros realizados
        <span
          className={cn(
            "ml-1 inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-black",
            active === "cadastros"
              ? "bg-[#171b22]/18 text-[#171b22]"
              : "bg-[#d7ad63]/12 text-[#f0d59b] ring-1 ring-[#d7ad63]/20",
          )}
        >
          {total}
        </span>
      </button>
    </nav>
  );
}