// Escreventes em ordem alfabética
export const ESCREVENTES = [
  "Alice",
  "Ana Carolina",
  "Andrey",
  "Angelo",
  "Bianca",
  "Carlos Eduardo",
  "Lucyana",
  "Rebeca",
  "Samela",
  "Wagner",
] as const;

export const OUTRO_ESCREVENTE = "Outro";

// Motivos de gratuidade comuns no contexto de cartório / jurídico
export const MOTIVOS = [
  "Ofício Sejusc nº.",
  "Ofício Semasc nº.",
  "Declaração de Hipossuficiência",
  "Mandado de Averbação de",
  "Ofício CGJ nº.",
  "Ofício DPE nº.",
  "Ofício Justiça Itinerante nº",
] as const;

export const TIPOS_CERTIDAO = [
  "Certidão Eletrônica",
  "Certidão Física",
] as const;

export const STORAGE_KEY = "cadastro-gratuidade-v1";

// Valor usado quando a parte interessada não possui telefone ou e-mail
export const SEM_CONTATO = "Não possui";
export const GOOGLE_SCRIPT_URL_KEY = "cadastro-gratuidade-google-script-url";

// Web App do Google Apps Script vinculado à planilha do cartório
export const DEFAULT_GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxc7nV0XUp1_J6h6UxcVGyu5KKNAw4Ojk9rGD2GoZeV0Qax5_K3_Qj2-NVrKSELfBH0/exec";

export const APP_TITLE = "Cartório Azevedo Martiniano";
export const APP_SUBTITLE = "4º Registro Civil das Pessoas Naturais";
