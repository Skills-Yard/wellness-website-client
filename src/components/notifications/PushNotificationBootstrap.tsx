"use client";

import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePushRegistration } from "@/src/hooks/usePushRegistration";
import { cn } from "@/src/lib/utils";

/** Mounted once near the app root. Runs usePushRegistration's effects
 *  (silent token resync + live foreground-push handling) and renders the
 *  toast stack it produces — see usePushRegistration for why this exists
 *  alongside the OS notification. */
export default function PushNotificationBootstrap() {
  const { toasts, dismissToast } = usePushRegistration();
  const router = useRouter();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-100 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4 sm:w-full sm:max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className="animate-in slide-in-from-top-2 fade-in pointer-events-auto flex w-full gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.16)]"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Bell className="h-4 w-4" />
          </span>

          <div
            role={toast.deeplink ? "button" : undefined}
            tabIndex={toast.deeplink ? 0 : undefined}
            className={cn("min-w-0 flex-1", toast.deeplink && "cursor-pointer")}
            onClick={() => {
              if (toast.deeplink) router.push(toast.deeplink);
              dismissToast(toast.id);
            }}
          >
            <p className="truncate text-sm font-bold text-gray-900">{toast.title}</p>
            {toast.body && (
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{toast.body}</p>
            )}
          </div>

          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 cursor-pointer text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
