/**
 * Validate a `redirect` search param. Only same-origin RELATIVE paths are
 * accepted to prevent open-redirect attacks.
 */
export function safeRedirect(target: unknown): string | null {
  if (typeof target !== "string" || target.length === 0) return null;
  // Reject protocol-relative and absolute URLs.
  if (target.startsWith("//")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return null;
  if (!target.startsWith("/")) return null;
  if (target.startsWith("/auth/")) return null; // don't loop back to auth pages
  return target;
}
