"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CalendarClock, ChevronRight, ClipboardList } from "lucide-react";
import { bookingApi } from "@/src/services/bookingApi";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import { LoadMoreButton } from "@/src/components/ui/load-more-button";
import type { Booking } from "@/src/types/booking";
import {
  formatBookingAmount,
  formatBookingDate,
  formatBookingTime,
  getStatusMeta,
  resolveImageSrc,
} from "./bookingStatus";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import BottomNav from "@/src/components/home/mobile/Bottomnav";
import LazyAuthModal from "@/src/components/auth/LazyAuthModal";

type Tab = "upcoming" | "past";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

function BookingCard({ booking, onOpen }: { booking: Booking; onOpen: () => void }) {
  const status = getStatusMeta(booking.status);
  const thumbnail = resolveImageSrc(booking.items[0]?.serviceItem?.thumbnailKey);
  const title =
    booking.items.length === 1
      ? booking.items[0].serviceItemName
      : `${booking.items[0]?.serviceItemName ?? "Service"} + ${booking.items.length - 1} more`;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-colors hover:bg-slate-50 cursor-pointer"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ClipboardList className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-bold text-slate-900">{title}</p>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <CalendarClock className="h-3 w-3" />
          {formatBookingDate(booking.scheduledDate)} • {formatBookingTime(booking.scheduledTime)}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {booking.partner?.name ? `Partner: ${booking.partner.name}` : "Partner not assigned yet"}
          </span>
          <span className="text-xs font-bold text-slate-800">
            {formatBookingAmount(booking.totalAmount)}
          </span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
    </button>
  );
}

export default function BookingsListPage() {
  const router = useRouter();
  const { isMounted, isLoggedIn, showAuthModal, setShowAuthModal, handleAuthComplete } =
    useRequireAuth();
  const [tab, setTab] = useState<Tab>("upcoming");

  // scope maps the tab directly to the backend's status-group filter (see
  // BOOKING_SCOPE_STATUSES on the backend) instead of fetching every
  // booking and filtering a multi-status group client-side — the old
  // approach made a tab's shown count wrong/incomplete for as long as any
  // page remained unloaded, once this became a real paginated fetch instead
  // of always walking every page up front.
  const scope = tab === "upcoming" ? "UPCOMING" : "PAST";

  const { items: bookings, counts, isLoading, isFetchingNextPage, hasMore, loadMore } =
    usePaginatedList<Booking>(
      ["bookings", scope],
      (page, limit) => {
        const accessToken = getAccessToken();
        if (!accessToken) return Promise.resolve({ data: [] });
        return bookingApi.findAllPage(accessToken, page, limit, { scope });
      },
      { limit: 20, enabled: isLoggedIn },
    );

  // `counts.upcoming`/`counts.past` come back from the backend regardless of
  // which `scope` was requested (they're computed over the same
  // userId+q+scheduledDate scope, just without the scope/status filter
  // itself) — so whichever tab is currently loaded already carries both
  // tabs' totals, no second request needed.
  const upcomingCount = counts?.upcoming;
  const pastCount = counts?.past;

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <ClipboardList className="mb-4 h-10 w-10 text-stone-300" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-bold text-slate-900">Log in to see your bookings</h2>
        <p className="mb-6 max-w-xs text-sm text-slate-500">
          Your upcoming and past appointments will show up here once you&apos;re logged in.
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Bookings</h1>
        </div>

        <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1">
          {(["upcoming", "past"] as const).map((value) => {
            const count = value === "upcoming" ? upcomingCount : pastCount;
            return (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-colors cursor-pointer ${
                  tab === value ? "bg-white text-amber-600 shadow-sm" : "text-slate-500"
                }`}
              >
                {value}
                {count !== undefined && <span className="ml-1 tabular-nums">({count})</span>}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-14 text-center">
            <ClipboardList className="mb-3 h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <p className="text-sm text-slate-500">
              {tab === "upcoming"
                ? "No upcoming bookings — go book a service you'll love."
                : "No past bookings yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onOpen={() => router.push(`/bookings/${booking.id}`)}
              />
            ))}
          </div>
        )}

        {hasMore && <LoadMoreButton onClick={loadMore} loading={isFetchingNextPage} />}
      </div>

      <div className="block md:hidden">
        <BottomNav
          activeTab="profile"
          onTabClick={(tabId) => {
            if (tabId === "top" || tabId === "home") router.push("/");
            else router.push(`/?tab=${tabId}`);
          }}
        />
      </div>
    </div>
  );
}
