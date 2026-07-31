/**
 * JWT token storage. Keyed under `skillsync.auth.*` so future additions
 * (e.g. refresh token) fit alongside without collision.
 */
export const STORAGE_KEY = "skillsync.auth.token";

const isBrowser = () => typeof window !== "undefined";

export const tokenStorage = {
  get(): string | null {
    if (!isBrowser()) return null;
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, token);
    } catch {
      /* ignore */
    }
  },
  clear() {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};
