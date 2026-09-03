"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, MonitorSmartphone } from "lucide-react";
import { toast } from "react-toastify";
import { useDevices, useRevokeDevice } from "@/src/hooks/queries/useDevices";
import { authApi } from "@/src/services/authApi";
import { unregisterPushToken } from "@/src/lib/notifications/push";
import BottomNav from "@/src/components/home/mobile/Bottomnav";
import DeviceRow from "./DeviceRow";
import type { DeviceItem } from "@/src/types/auth";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import LazyAuthModal from "@/src/components/auth/LazyAuthModal";
import { notifyAuthChanged } from "@/src/utils/auth/authEvents";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export default function DevicesPage() {
  const router = useRouter();
  const { isMounted, isLoggedIn, showAuthModal, setShowAuthModal, handleAuthComplete } =
    useRequireAuth();
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const { data: devices = [], isLoading } = useDevices();
  const revokeDevice = useRevokeDevice();

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <MonitorSmartphone className="mb-4 h-10 w-10 text-stone-300" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-bold text-slate-900">Log in to manage your devices</h2>
        <p className="mb-6 max-w-xs text-sm text-slate-500">
          See every device signed in to your account and sign any of them out.
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="rounded-2xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-amber-500/90"
        >
          Log in
        </button>
        {showAuthModal && (
          <LazyAuthModal
            onClose={() => setShowAuthModal(false)}
            onComplete={handleAuthComplete}
            redirectToProfile={false}
          />
        )}
      </div>
    );
  }

  // Ends the local session the same way Profile's own "Log Out" does —
  // needed whenever the device being removed turns out to be this one.
  const endLocalSession = async () => {
    const accessToken = getAccessToken();
    if (accessToken) await unregisterPushToken(accessToken);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("isUserLoggedIn");
    notifyAuthChanged();
    router.replace("/");
  };

  const handleRevoke = (device: DeviceItem) => {
    revokeDevice.mutate(
      { kind: device.kind, id: device.id },
      {
        onSuccess: async () => {
          if (device.isCurrent) {
            toast.success("Logged out of this device.");
            await endLocalSession();
            return;
          }
          toast.success("Device logged out.");
        },
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Couldn't log out that device."),
      },
    );
  };

  const handleLogoutAll = async () => {
    const accessToken = getAccessToken();
    if (!accessToken || isLoggingOutAll) return;

    setIsLoggingOutAll(true);
    try {
      await authApi.logoutAll(accessToken);
      toast.success("Logged out of all devices.");
      await endLocalSession();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't log out of all devices.");
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-10">
      <div className="mx-auto max-w-2xl bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="rounded-full p-1.5 hover:bg-slate-100 cursor-pointer"
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Devices</h1>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Everywhere you&apos;re currently signed in, and every device registered for push
          notifications.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
          ) : devices.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-14 text-center">
              <MonitorSmartphone className="mb-3 h-8 w-8 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm text-slate-500">No active devices found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {devices.map((device) => (
                <DeviceRow
                  key={`${device.kind}-${device.id}`}
                  device={device}
                  onRevoke={() => handleRevoke(device)}
                  isRevoking={
                    revokeDevice.isPending &&
                    revokeDevice.variables?.kind === device.kind &&
                    revokeDevice.variables?.id === device.id
                  }
                />
              ))}
            </div>
          )}
        </div>

        {devices.length > 1 && (
          <button
            onClick={handleLogoutAll}
            disabled={isLoggingOutAll}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOutAll ? "Logging out…" : "Log out of all devices"}
          </button>
        )}
        <p className="mt-2 text-center text-xs text-slate-400">
          This signs you out everywhere, including this device.
        </p>
      </div>

      <div className="block md:hidden">
        <BottomNav onHomeClick={() => router.push("/")} />
      </div>
    </div>
  );
}
