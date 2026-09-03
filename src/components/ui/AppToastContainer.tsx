"use client";

import { useEffect, useState } from "react";
import { ToastContainer, Slide } from "react-toastify";
import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from "lucide-react";

// Mirrors a native/FCM web push notification: on desktop it's a compact
// card pinned to the top-right that slides in from the right, the way
// Chrome/Windows/macOS stack their notification banners; on a narrow
// screen it instead slides down from the top, full width, like a mobile
// heads-up notification. `Slide`'s direction follows react-toastify's
// `position` prop, so the two need an actual position switch (not just a
// CSS override) to each slide the right way.
function useIsDesktop(breakpointPx = 640) {
  const [isDesktop, setIsDesktop] = useState(true); // matches most first paints; corrected on mount
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpointPx]);
  return isDesktop;
}

const TOAST_ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-[#208900]" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  info: <Info className="h-5 w-5 text-amber-600" />,
};

/** Single app-wide toast host — mounted once in Providers. Renders every
 *  `toast.success/error/info/loading(...)` call from anywhere in the app,
 *  styled to match the OS-style push notification look (see the
 *  `.Toastify__*` overrides in globals.css). */
export default function AppToastContainer() {
  const isDesktop = useIsDesktop();

  return (
    <ToastContainer
      position={isDesktop ? "top-right" : "top-center"}
      transition={Slide}
      newestOnTop
      hideProgressBar
      icon={({ type, isLoading }) =>
        isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
        ) : (
          (TOAST_ICONS[type] ?? TOAST_ICONS.info)
        )
      }
    />
  );
}
