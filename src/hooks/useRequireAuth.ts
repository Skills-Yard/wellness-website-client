"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { notifyAuthChanged } from "@/src/utils/auth/authEvents";

/**
 * Shared "wait for client mount, then gate on a real session" hook for
 * every route that requires login (bookings, devices, notifications,
 * profile). Checks the access token itself — present *and* unexpired, via
 * hasValidAccessToken — rather than the `isUserLoggedIn` flag those pages
 * used to key off of, which stays "true" in localStorage long after the
 * token it was set alongside has actually expired.
 *
 * isLoggedIn is sourced from useAuthStatus, so it also stays in sync when
 * login/logout happens somewhere else in the app (e.g. the navbar, or the
 * cart's inline auth prompt) — not just when this hook's own
 * handleAuthComplete/setIsLoggedIn fires.
 *
 * `showAuthModal` starts `true` the moment mount confirms there's no valid
 * session, so a visitor lands straight on the login prompt instead of
 * needing to find and click a "log in" button first — the caller still
 * decides what to render behind it (see each page's own "log in to see
 * this" fallback) and can reopen it later via `setShowAuthModal`.
 */
export function useRequireAuth() {
  const { isMounted, isLoggedIn, refresh } = useAuthStatus();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (isMounted) setShowAuthModal(!isLoggedIn);
    // Only ever meant to seed the initial "no session yet" prompt once
    // mount settles — not to re-open the modal every time isLoggedIn flips
    // (e.g. right after handleAuthComplete already closed it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const handleAuthComplete = () => {
    refresh();
    setShowAuthModal(false);
  };

  // Exposed for callers that need to flip the local session off directly
  // (e.g. Profile's own "Log Out" button, right after it clears
  // localStorage) — also notifies every other isLoggedIn consumer in the
  // app, the same way AuthModal's own completeAuthentication does for
  // logging in. `value` itself isn't trusted — refresh() re-derives the
  // real answer from the token, same as every other transition.
  const setIsLoggedIn = useCallback((_value: boolean) => {
    notifyAuthChanged();
    refresh();
  }, [refresh]);

  return {
    isMounted,
    isLoggedIn,
    setIsLoggedIn,
    showAuthModal,
    setShowAuthModal,
    handleAuthComplete,
  };
}
