/**
 * Máscara de telefone brasileiro.
 * Aceita celular (11 dígitos): (11) 99999-9999
 * e fixo (10 dígitos):            (11) 3333-4444
 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function cleanDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidPhone(value: string): boolean {
  const d = cleanDigits(value);
  // Aceita telefone fixo ou celular com DDD, inclusive DDDs da faixa 90.
  return (d.length === 10 || d.length === 11) && d.slice(0, 2) !== "00";
}

/**
 * Normalização de e-mail (remove espaços e converte para minúsculas).
 */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}
