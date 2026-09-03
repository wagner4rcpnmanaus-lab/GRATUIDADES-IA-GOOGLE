import { useCallback, useEffect, useRef, useState } from "react";
import type { FormState, Registration } from "../types";
import { STORAGE_KEY } from "../constants";
import {
  generateId,
  generateProtocolo,
  isoDaysAgo,
  normalizeEscrevente,
  renumberProtocols,
} from "../utils/helpers";

function buildSeed(): Registration[] {
  const now = Date.now();
  return [
    {
      id: "seed-1",
      protocolo: "001",
      escrevente: "Alice",
      motivo: "Beneficiário da Justiça Gratuita",
      tipoCertidao: "Certidão Eletrônica",
      parteInteressada: "Maria Aparecida dos Santos",
      telefone: "(11) 98765-4321",
      email: "maria.santos@email.com",
      data: isoDaysAgo(0),
      observacoes: "Apresentou declaração de hipossuficiência assinada.",
      createdAt: now - 1000 * 60 * 60 * 5,
      updatedAt: now - 1000 * 60 * 60 * 5,
    },
    {
      id: "seed-2",
      protocolo: "001",
      escrevente: "Carlos Eduardo",
      motivo: "Estatuto do Idoso (Lei nº 10.741/2003)",
      tipoCertidao: "Certidão Física",
      parteInteressada: "José Ferreira Lima",
      telefone: "(11) 3234-5566",
      email: "jose.lima@email.com",
      data: isoDaysAgo(1),
      observacoes: "",
      createdAt: now - 1000 * 60 * 60 * 26,
      updatedAt: now - 1000 * 60 * 60 * 26,
    },
    {
      id: "seed-3",
      protocolo: "001",
      escrevente: "Bianca",
      motivo: "Defensoria Pública",
      tipoCertidao: "Certidão Eletrônica",
      parteInteressada: "Construtora Horizonte Ltda",
      telefone: "(21) 99888-7766",
      email: "contato@horizonte.com.br",
      data: isoDaysAgo(3),
      observacoes: "Atendimento via Ofício da Defensoria.",
      createdAt: now - 1000 * 60 * 60 * 70,
      updatedAt: now - 1000 * 60 * 60 * 70,
    },
  ];
}

function load(): Registration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return (parsed as Registration[]).map((r) => ({
          ...r,
          escrevente: normalizeEscrevente(r.escrevente),
        }));
      }
    }
    return buildSeed();
  } catch {
    return buildSeed();
  }
}

export function useRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    } catch {
      /* storage indisponível */
    }
  }, [registrations]);

  // Referência sempre atualizada ao último estado sincronizado
  const registrationsRef = useRef(registrations);
  useEffect(() => {
    registrationsRef.current = registrations;
  }, [registrations]);

  const add = useCallback((data: FormState): Registration => {
    const lockKey = `cadastro-gratuidade-lock-${data.data}`;
    try {
      localStorage.removeItem(lockKey);
    } catch {
      /* ignora */
    }

    const id = generateId();
    const now = Date.now();
    // Calcula o protocolo com base no estado MAIS RECENTE da planilha
    // (não usa closure antiga) para evitar "001" incorreto em corrida.
    const protocolo = generateProtocolo(registrationsRef.current, data.data);

    const reg: Registration = {
      ...data,
      id,
      protocolo,
      createdAt: now,
      updatedAt: now,
    };

    setRegistrations((prev) => [reg, ...prev]);

    try {
      localStorage.setItem(lockKey, String(now));
      window.setTimeout(() => {
        try {
          localStorage.removeItem(lockKey);
        } catch {
          /* ignora */
        }
      }, 2000);
    } catch {
      /* ignora */
    }

    return reg;
  }, []);

  const update = useCallback((id: string, data: FormState) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, ...data, updatedAt: Date.now() } : r,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setRegistrations((prev) =>
      renumberProtocols(prev.filter((r) => r.id !== id)),
    );
  }, []);

  const replaceAll = useCallback((records: Registration[]) => {
    setRegistrations(records);
  }, []);

  return { registrations, add, update, remove, replaceAll };
}
