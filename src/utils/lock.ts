const LOCK_KEY = "cadastro-gratuidade-lock-";

export function acquireLock(dayKey: string): boolean {
  const lockName = LOCK_KEY + dayKey;
  try {
    const value = Date.now() + "-" + Math.random();
    localStorage.setItem(lockName, value);
  } catch {
    return false;
  }
  return true;
}

export function releaseLock(dayKey: string): void {
  const lockName = LOCK_KEY + dayKey;
  localStorage.removeItem(lockName);
}
