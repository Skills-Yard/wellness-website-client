"use client";

import { useEffect, useState } from "react";
import { hasValidAccessToken } from "@/src/utils/auth/token";

/**
 * Shared "wait for client mount, then gate on a real session" hook for
 * every route that requires login (bookings, devices, notifications,
 * profile). Checks the access token itself — present *and* unexpired, via
 * hasValidAccessToken — rather than the `isUserLoggedIn` flag those pages
 * used to key off of, which stays "true" in localStorage long after the
 * token it was set alongside has actually expired.
 *
 * `showAuthModal` starts `true` the moment mount confirms there's no valid
 * session, so a visitor lands straight on the login prompt instead of
 * needing to find and click a "log in" button first — the caller still
 * decides what to render behind it (see each page's own "log in to see
 * this" fallback) and can reopen it later via `setShowAuthModal`.
 */
export function useRequireAuth() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const valid = hasValidAccessToken();
    setIsLoggedIn(valid);
    setShowAuthModal(!valid);
    setIsMounted(true);
  }, []);

  const handleAuthComplete = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  return {
    isMounted,
    isLoggedIn,
    setIsLoggedIn,
    showAuthModal,
    setShowAuthModal,
    handleAuthComplete,
  };
}
