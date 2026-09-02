/**
 * Every screen that cares whether the visitor is logged in used to read
 * `accessToken`/`isUserLoggedIn` from localStorage exactly once, on mount
 * (Navbar, NotificationBell's self-detect, useRequireAuth, ...). That's why
 * logging in through one of them (e.g. the cart's inline auth prompt) left
 * every *other* already-mounted one — like the navbar's "Log in"/"Profile"
 * label — stuck showing the stale value until a full page reload.
 *
 * `notifyAuthChanged()` is called right after every place that writes those
 * localStorage keys (AuthModal's completeAuthentication, every logout path,
 * apiClient's forced-logout-on-refresh-failure). `useAuthStatus` (see
 * useAuthStatus.ts) listens for it and recomputes, so every consumer of that
 * hook re-renders with the fresh value the instant any one of them changes
 * it — no reload, no prop threading required.
 */
export const AUTH_CHANGED_EVENT = "eezit-auth-changed";

export function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
