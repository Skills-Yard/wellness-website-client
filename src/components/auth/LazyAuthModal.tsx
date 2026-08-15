"use client";

import dynamic from "next/dynamic";

// AuthModal only ever renders after a user clicks "Login"/"Sign up" — no
// SEO value in shipping it in the initial bundle. Wrapped once here since
// it's imported from two unrelated trees (Navbar, Profile).
const LazyAuthModal = dynamic(() => import("./AuthModal"), {
  ssr: false,
  loading: () => null,
});

export default LazyAuthModal;
