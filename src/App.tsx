import { useEffect, useState } from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import RegistrationForm from "./components/RegistrationForm";
import RegistrationList from "./components/RegistrationList";
import ToastContainer from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import TabNav, { type Tab } from "./components/TabNav";
import { useRegistrations } from "./hooks/useRegistrations";
import { useGoogleSheetsSync } from "./hooks/useGoogleSheetsSync";
import { useToasts } from "./hooks/useToasts";
import type { FormState, Registration } from "./types";

export default function App() {
  const { registrations, add, update, remove, replaceAll } = useRegistrations();
  const { toasts, push, dismiss } = useToasts();
  // A integração continua ativa, mas fica invisível para não ocupar a tela.
  useGoogleSheetsSync({ registrations, replaceAll });

  const [editing, setEditing] = useState<Registration | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Registration | null>(null);
  const [recentProtocol, setRecentProtocol] = useState<string | null>(null);
  const [recentProtocolId, setRecentProtocolId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("novo");

  // Sempre que os registros mudarem, se há um protocolo recém-criado
  // aguardando exibição, atualiza o número mostrado com o valor final do estado.
  // Isso garante que mesmo renumerações feitas após a sincronização
  // com a planilha apareçam corretamente no modal.
  useEffect(() => {
    if (!recentProtocolId) return;
    const finalReg = registrations.find((r) => r.id === recentProtocolId);
    if (finalReg) setRecentProtocol(finalReg.protocolo);
  }, [registrations, recentProtocolId]);

  const handleSubmit = (data: FormState) => {
    if (editing) {
      update(editing.id, data);
      push("success", `Protocolo ${editing.protocolo} atualizado com sucesso.`);
      setEditing(null);
      setTab("cadastros");
    } else {
      const pending = add(data);
      setRecentProtocolId(pending.id);
      // Mostra o número inicial imediatamente (rápido para o usuário),
      // mas o efeito acima o corrige se a sincronização renumerar.
      setRecentProtocol(pending.protocolo);
      push(
        "success",
        `Gratuidade cadastrada com sucesso.`,
      );
    }
  };

  const handleEdit = (reg: Registration) => {
    setEditing(reg);
    setTab("novo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    push("info", "Edição cancelada.");
    setTab("cadastros");
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    remove(pendingDelete.id);
    push("info", `Cadastro de "${pendingDelete.parteInteressada}" removido.`);
    if (editing?.id === pendingDelete.id) setEditing(null);
    setPendingDelete(null);
  };

  return (
    <div className="app-shell min-h-screen">
      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <StatsBar registrations={registrations} />

        <div className="mt-6 lg:mt-8">
          <TabNav active={tab} onChange={setTab} total={registrations.length} />
        </div>

        <div className="mt-6">
          {tab === "novo" ? (
            <div className="mx-auto max-w-2xl">
              <RegistrationForm
                editing={editing}
                onSubmit={handleSubmit}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          ) : (
            <RegistrationList
              registrations={registrations}
              onEdit={handleEdit}
              onRequestDelete={setPendingDelete}
            />
          )}
        </div>
      </main>

      <footer className="no-print relative z-10 mt-10 border-t border-[#d7ad63]/14 bg-[#151b24]/50 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-center text-xs text-[#fff6e6]/38 sm:flex-row sm:px-6 sm:text-left">
          <p>
            {new Date().getFullYear()} · Cartório Azevedo Martiniano.
            Dados armazenados localmente no navegador.
          </p>
          <p className="text-[#d7ad63]/58">Controle interno de atendimentos.</p>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {recentProtocol && (
        <div className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-[#090d14]/78 p-4 backdrop-blur-md">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="protocolo-gerado"
            className="animate-modal lux-panel w-full max-w-lg rounded-[2rem] p-8 text-center shadow-2xl ring-8 ring-[#d7ad63]/10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f0d59b]/80">
              Cadastro realizado
            </p>
            <h2
              id="protocolo-gerado"
              className="gold-text mt-4 font-serif text-5xl font-semibold sm:text-6xl"
            >
              Protocolo {recentProtocol}
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-base font-medium text-[#fff6e6]/72">
              Anote este protocolo no documento apresentado.
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => {
                setRecentProtocol(null);
                setRecentProtocolId(null);
              }}
              className="lux-button-primary mt-8 w-full rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wide transition sm:w-auto sm:min-w-40"
            >
              OK
            </button>
          </section>
        </div>
      )}

      <ConfirmModal
        open={pendingDelete !== null}
        title="Excluir cadastro"
        message={
          pendingDelete
            ? `Tem certeza que deseja excluir o cadastro de "${pendingDelete.parteInteressada}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
