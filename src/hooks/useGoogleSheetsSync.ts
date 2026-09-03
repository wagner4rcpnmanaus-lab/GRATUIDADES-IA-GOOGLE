import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_GOOGLE_SCRIPT_URL, GOOGLE_SCRIPT_URL_KEY } from "../constants";
import type { Registration } from "../types";
import {
  fetchSheetRecords,
  recordsHash,
  replaceSheetRecords,
} from "../services/googleSheets";
import { renumberProtocols } from "../utils/helpers";

type SyncState = "off" | "syncing" | "synced" | "error";

interface Args {
  registrations: Registration[];
  replaceAll: (records: Registration[]) => void;
}

export function useGoogleSheetsSync({ registrations, replaceAll }: Args) {
  const [endpoint, setEndpointState] = useState(
    () => localStorage.getItem(GOOGLE_SCRIPT_URL_KEY) || DEFAULT_GOOGLE_SCRIPT_URL,
  );
  const [status, setStatus] = useState<SyncState>(endpoint ? "syncing" : "off");
  const [message, setMessage] = useState(
    endpoint ? "Conectando ao Google Sheets..." : "Informe a URL do Apps Script.",
  );
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);

  const readyRef = useRef(false);
  const applyingRemoteRef = useRef(false);
  const lastHashRef = useRef("");
  const registrationsRef = useRef(registrations);
  const pullInFlightRef = useRef(false);

  useEffect(() => {
    registrationsRef.current = registrations;
  }, [registrations]);

  const setEndpoint = useCallback((value: string) => {
    const next = value.trim();
    setEndpointState(next);
    readyRef.current = false;
    lastHashRef.current = "";
    if (next) {
      localStorage.setItem(GOOGLE_SCRIPT_URL_KEY, next);
      setStatus("syncing");
      setMessage("Conectando ao Google Sheets...");
    } else {
      localStorage.removeItem(GOOGLE_SCRIPT_URL_KEY);
      setStatus("off");
      setMessage("Informe a URL do Apps Script.");
    }
  }, []);

  const pull = useCallback(async () => {
    if (!endpoint || pullInFlightRef.current) return;
    pullInFlightRef.current = true;
    setStatus("syncing");
    try {
      const fetched = await fetchSheetRecords(endpoint);
      const remote = renumberProtocols(fetched);
      const remoteHash = recordsHash(remote);
      const local = registrationsRef.current;
      if (recordsHash(fetched) !== remoteHash) {
        // A planilha tem protocolos duplicados/fora de sequência: corrige.
        void replaceSheetRecords(endpoint, remote);
      }
      if (remote.length > 0 && remoteHash !== recordsHash(local)) {
        applyingRemoteRef.current = true;
        replaceAll(remote);
      } else if (remote.length === 0 && local.length > 0) {
        await replaceSheetRecords(endpoint, local);
      }
      lastHashRef.current = remote.length > 0 ? remoteHash : recordsHash(local);
      readyRef.current = true;
      setLastSyncAt(Date.now());
      setStatus("synced");
      setMessage("Planilha sincronizada.");
    } catch (error) {
      readyRef.current = false;
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Erro ao sincronizar.");
    } finally {
      pullInFlightRef.current = false;
      window.setTimeout(() => {
        applyingRemoteRef.current = false;
      }, 0);
    }
  }, [endpoint, replaceAll]);

  useEffect(() => {
    if (!endpoint) return;
    void pull();
    const id = window.setInterval(() => void pull(), 3000);
    const onOnline = () => void pull();
    const onVisible = () => {
      if (document.visibilityState === "visible") void pull();
    };
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [endpoint, pull]);

  useEffect(() => {
    if (!endpoint || !readyRef.current || applyingRemoteRef.current) return;
    const hash = recordsHash(registrations);
    if (hash === lastHashRef.current) return;
    let cancelled = false;
    setStatus("syncing");
    replaceSheetRecords(endpoint, registrations)
      .then(() => {
        if (cancelled) return;
        lastHashRef.current = hash;
        setLastSyncAt(Date.now());
        setStatus("synced");
        setMessage("Alterações enviadas para a planilha.");
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Erro ao enviar alterações.");
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, registrations]);

  return { endpoint, setEndpoint, status, message, lastSyncAt, pull };
}