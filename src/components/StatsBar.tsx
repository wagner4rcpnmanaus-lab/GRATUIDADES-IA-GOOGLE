import { useMemo } from "react";
import type { Registration } from "../types";
import { isConcluido, todayISO } from "../utils/helpers";
import { AlertIcon, CalendarIcon, FileTextIcon, ScaleIcon } from "./icons";

interface Props {
  registrations: Registration[];
}

interface Stat {
  label: string;
  value: string;
  Icon: typeof FileTextIcon;
}

export default function StatsBar({ registrations }: Props) {
  const stats = useMemo<Stat[]>(() => {
    const today = todayISO();
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const total = registrations.length;
    const hoje = registrations.filter((r) => r.data === today).length;
    const noMes = registrations.filter((r) => r.data.startsWith(month)).length;
    const pendentes = registrations.filter(
      (r) => !isConcluido(r) && !r.naoAtendido,
    ).length;

    return [
      { label: "Total de cadastros", value: String(total), Icon: FileTextIcon },
      { label: "Cadastrados no mês", value: String(noMes), Icon: ScaleIcon },
      { label: "RECEBIDOS HOJE", value: String(hoje), Icon: CalendarIcon },
      { label: "Pendentes de envio/expedição", value: String(pendentes), Icon: AlertIcon },
    ];
  }, [registrations]);

  return (
    <section className="no-print grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((s) => {
        const { Icon } = s;
        return (
          <div
            key={s.label}
            className="lux-card group relative overflow-hidden rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:border-[#d7ad63]/45 sm:p-5"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f0d59b]/70 to-transparent opacity-70" />
            <div className="flex items-center gap-3">
              <div className="gold-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#171b22] shadow-[0_12px_32px_rgba(155,111,44,0.22)] sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0d59b]/58">
                  {s.label}
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#fff6e6]">
                  {s.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}