import { useState } from "react";
import brasaoCartorio from "../assets/images/brasao_cartorio_1788441315262.jpg";
import { APP_SUBTITLE, APP_TITLE } from "../constants";
import { formatDateLong, todayISO } from "../utils/helpers";
import { ScaleIcon } from "./icons";

function BrandSeal() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center sm:mx-0 sm:h-36 sm:w-36">
      {/* Halo dourado suave atrás do brasão */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(215,173,99,0.26),transparent_66%)] blur-md" />
      {!imgError ? (
        <img
          src={brasaoCartorio}
          alt="Brasão do Cartório Azevedo Martiniano"
          onError={() => setImgError(true)}
          className="relative h-full w-full rounded-full object-cover border border-[#d7ad63]/40 shadow-2xl drop-shadow-[0_18px_38px_rgba(0,0,0,0.45)]"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center rounded-full border border-[#d7ad63]/40 bg-[#1e2530] text-[#f0d59b] shadow-2xl">
          <ScaleIcon className="h-14 w-14" />
        </div>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className="no-print relative overflow-hidden border-b border-[#d7ad63]/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_0%,rgba(215,173,99,0.18),transparent_30rem)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-7 sm:text-left">
          <BrandSeal />
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-[#f0d59b]/80">
              {APP_SUBTITLE}
            </p>
            <h1 className="gold-text mt-2 font-serif text-3xl font-semibold uppercase tracking-[0.08em] sm:text-5xl">
              {APP_TITLE}
            </h1>
            <div className="mt-3 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#d7ad63]/70 to-transparent sm:via-[#d7ad63]/50" />
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#fff6e6]/62">
              Controle de gratuidades e certidões
            </p>
          </div>
          <div className="lux-card rounded-2xl px-5 py-4 text-center sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#d7ad63]/80">
              Data de hoje
            </p>
            <p className="mt-1 font-serif text-base text-[#fff6e6]">
              {formatDateLong(todayISO())}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
