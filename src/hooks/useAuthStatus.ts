"use client";

import { useCallback, useEffect, useState } from "react";
import { hasValidAccessToken } from "@/src/utils/auth/token";
import { AUTH_CHANGED_EVENT } from "@/src/utils/auth/authEvents";

/**
 * Reactive, app-wide "am I logged in" — recomputed on mount, whenever
 * login/logout happens anywhere in the tab (see notifyAuthChanged), and
 * whenever another tab changes the same localStorage keys (the native
 * `storage` event). Prefer this over reading `accessToken`/`isUserLoggedIn`
 * from localStorage directly in a `useEffect` — that pattern is exactly
 * what left the navbar's login label (and others) stuck showing "Log in"
 * after completing login from elsewhere in the app.
 */
export function useAuthStatus() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refresh = useCallback(() => {
    setIsLoggedIn(hasValidAccessToken());
  }, []);

  useEffect(() => {
    refresh();
    setIsMounted(true);
    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return { isMounted, isLoggedIn, refresh };
}
