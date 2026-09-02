"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Laptop,
  MonitorSmartphone,
  Smartphone,
} from "lucide-react";
import type { MeDevice } from "@/src/types/auth";

const PAGE_SIZE = 5;

const fmtDateTime = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d
    .toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
};

/** "Chrome on Windows" etc., from a raw user-agent string. */
const describeUA = (ua: string | null) => {
  if (!ua) return "Unknown device";
  const browser =
    /Edg\//.test(ua) ? "Edge"
    : /OPR\/|Opera/.test(ua) ? "Opera"
    : /Firefox\//.test(ua) ? "Firefox"
    : /Chrome\//.test(ua) ? "Chrome"
    : /Safari\//.test(ua) ? "Safari"
    : "Browser";
  const os =
    /Windows/.test(ua) ? "Windows"
    : /Android/.test(ua) ? "Android"
    : /iPhone|iPad|iOS/.test(ua) ? "iOS"
    : /Mac OS X|Macintosh/.test(ua) ? "macOS"
    : /Linux/.test(ua) ? "Linux"
    : "Unknown";
  return `${browser} on ${os}`;
};

function OsIcon({ name, className }: { name: string; className?: string }) {
  if (/Android|iOS/.test(name)) return <Smartphone className={className} />;
  if (/Windows|macOS|Linux/.test(name)) return <Laptop className={className} />;
  return <MonitorSmartphone className={className} />;
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#208900]" : "bg-[#bbb]"}`}
      />
      <span className={active ? "text-[#208900]" : "text-[#999]"}>
        {active ? "Active" : "Inactive"}
      </span>
    </span>
  );
}

export default function DevicesTable({ devices }: { devices: MeDevice[] }) {
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(devices.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = useMemo(
    () => devices.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [devices, safePage],
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <MonitorSmartphone className="h-4.5 w-4.5 text-brown" />
        <h2 className="text-base font-semibold text-espresso">Devices</h2>
      </div>

      {devices.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/10 px-4 py-8 text-center text-sm text-[#999]">
          No devices registered.
        </p>
      ) : (
        <>
          {/* Mobile / tablet: stacked cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((d) => {
              const name = describeUA(d.deviceName);
              
              return (
                <div key={d.id} className="rounded-xl border border-black/5 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FBF7ED] text-brown">
                        <OsIcon name={name} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-espresso">{name}</p>
                        <p className="truncate text-xs text-[#999]">{d.deviceName ?? "—"}</p>
                      </div>
                    </div>
                    <StatusPill active={d.isActive} />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <dt className="text-[#999]">Type</dt>
                    <dd className="text-right text-espresso">{d.deviceType ?? "—"}</dd>
                    <dt className="text-[#999]">Last used</dt>
                    <dd className="text-right text-espresso">{fmtDateTime(d.lastUsedAt)}</dd>
                    <dt className="text-[#999]">Registered</dt>
                    <dd className="text-right text-espresso">{fmtDateTime(d.createdAt)}</dd>
                  </dl>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-xl border border-black/5 md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-[#FBF7ED] text-xs font-semibold text-[#666]">
                  <th className="px-4 py-3">Device Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Used</th>
                  <th className="px-4 py-3">Registered On</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => {
                  const name = describeUA(d.deviceName);
                  
                  return (
                    <tr key={d.id} className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBF7ED] text-brown">
                            <OsIcon name={name} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-espresso">{name}</p>
                            <p className="max-w-[280px] truncate text-xs text-[#999]">
                              {d.deviceName ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-espresso">
                          <Globe className="h-3.5 w-3.5 text-[#999]" />
                          {d.deviceType ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill active={d.isActive} />
                      </td>
                      <td className="px-4 py-3 text-espresso">{fmtDateTime(d.lastUsedAt)}</td>
                      <td className="px-4 py-3 text-espresso">{fmtDateTime(d.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#666]">
            <span>Total {devices.length} devices</span>
            {pageCount > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-black/10 disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    className={`h-7 min-w-7 rounded-md px-2 text-xs font-semibold ${
                      i === safePage
                        ? "bg-amber-600 text-white"
                        : "border border-black/10 text-[#666] hover:bg-stone-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={safePage === pageCount - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-black/10 disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
