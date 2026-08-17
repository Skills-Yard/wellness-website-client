"use client";

import { useEffect, useState } from "react";

/** Shared "wait for client mount, then read login state" pattern used by
 *  every bookings screen (same logic NotificationsPage/Profile duplicate
 *  inline — pulled out here since both bookings pages need it). Avoids a
 *  Next.js hydration mismatch by not trusting localStorage until mounted. */
export function useIsLoggedIn() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(localStorage.getItem("isUserLoggedIn") === "true");
  }, []);

  return { isMounted, isLoggedIn };
}
