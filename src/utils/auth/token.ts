/**
 * Decodes a JWT's payload and checks its `exp` claim against the current
 * time. This is a client-side gate only — it doesn't guarantee the token
 * still works server-side (it could be revoked), but it catches the common
 * case (missing or expired token) without a network round trip. A token
 * with no `exp` claim, or one that fails to decode, is treated as invalid
 * rather than assumed valid, since the caller has no way to tell it apart
 * from a corrupted/tampered value.
 */
export function isAccessTokenValid(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/** Reads `accessToken` straight from localStorage and checks it via
 *  {@link isAccessTokenValid} — the shape every call site actually needs. */
export function hasValidAccessToken(): boolean {
  if (typeof window === "undefined") return false;
  return isAccessTokenValid(localStorage.getItem("accessToken"));
}
