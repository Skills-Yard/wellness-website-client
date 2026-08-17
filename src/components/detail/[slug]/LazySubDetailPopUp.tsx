"use client";

import dynamic from "next/dynamic";

// SubDetailPopUp (service detail popup: hero, packages, durations, add-ons)
// only ever renders after a service card is clicked, and is imported from
// two unrelated trees (the home page's CategoryServices and the detail
// page's SpaBookingLayout) — wrapped once here so both share one chunk
// instead of it sitting in either page's initial bundle.
const LazySubDetailPopUp = dynamic(() => import("./mainfile"), {
  ssr: false,
  loading: () => null,
});

export default LazySubDetailPopUp;
