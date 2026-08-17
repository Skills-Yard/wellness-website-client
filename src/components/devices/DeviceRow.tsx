"use client";

import { MonitorSmartphone, Smartphone } from "lucide-react";
import { timeAgo } from "@/src/components/notifications/timeAgo";
import type { DeviceItem } from "@/src/types/auth";

/** Best-effort friendly label from a raw User-Agent string. This project has
 *  no UA-parsing dependency — this covers the common browsers/OSes well
 *  enough for a device list and simply falls back when it can't tell. */
function describeUserAgent(userAgent: string | null): string | null {
  if (!userAgent) return null;

  const os = /Windows/.test(userAgent)
    ? "Windows"
    : /Mac OS X/.test(userAgent)
      ? "Mac"
      : /Android/.test(userAgent)
        ? "Android"
        : /iPhone|iPad|iPod/.test(userAgent)
          ? "iOS"
          : /Linux/.test(userAgent)
            ? "Linux"
            : null;

  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /Chrome\//.test(userAgent)
      ? "Chrome"
      : /Firefox\//.test(userAgent)
        ? "Firefox"
        : /Safari\//.test(userAgent)
          ? "Safari"
          : null;

  return [browser, os].filter(Boolean).join(" on ") || null;
}

export default function DeviceRow({
  device,
  onRevoke,
  isRevoking,
}: {
  device: DeviceItem;
  onRevoke: () => void;
  isRevoking: boolean;
}) {
  const isMobile = device.deviceType === "ANDROID" || device.deviceType === "IOS";
  const title =
    device.deviceName ||
    describeUserAgent(device.userAgent) ||
    (device.kind === "TOKEN" ? "Push notification device" : "Unknown device");

  const subtitleParts = [
    device.deviceModel,
    device.kind === "TOKEN" ? "Push notifications only" : device.ipAddress,
  ].filter((part): part is string => !!part);

  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        {isMobile ? <Smartphone className="h-5 w-5" /> : <MonitorSmartphone className="h-5 w-5" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium text-slate-900">{title}</p>
          {device.isCurrent && (
            <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              This device
            </span>
          )}
        </div>
        {subtitleParts.length > 0 && (
          <p className="truncate text-xs text-slate-500">{subtitleParts.join(" · ")}</p>
        )}
        <p className="text-xs text-slate-400">Active {timeAgo(device.lastUsedAt)}</p>
      </div>

      <button
        onClick={onRevoke}
        disabled={isRevoking}
        className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
      >
        {isRevoking ? "…" : "Log out"}
      </button>
    </div>
  );
}
