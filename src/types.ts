export interface Registration {
  id: string;
  protocolo: string;
  escrevente: string;
  motivo: string;
  tipoCertidao: string;
  parteInteressada: string;
  telefone: string;
  email: string;
  data: string; // yyyy-mm-dd
  observacoes?: string;
  naoAtendido?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type FormState = Omit<
  Registration,
  "id" | "protocolo" | "createdAt" | "updatedAt"
>;

export type FormErrors = Partial<Record<keyof FormState, string>>;
