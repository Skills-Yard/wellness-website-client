"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, BellOff } from "lucide-react";
import { useNotifications, useMarkAllNotificationsRead } from "@/src/hooks/queries/useNotifications";
import BottomNav from "@/src/components/home/mobile/Bottomnav";
import NotificationRow from "./NotificationRow";

const PAGE_SIZE = 20;

export default function NotificationsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data: notifications = [], isLoading } = useNotifications(visibleCount);
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(localStorage.getItem("isUserLoggedIn") === "true");
  }, []);

  // Visiting this page directly (not via the bell dropdown) is also "seeing"
  // your notifications — same as opening the dropdown, it clears the highlight.
  useEffect(() => {
    if (isLoggedIn) markAllRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <BellOff className="mb-4 h-10 w-10 text-stone-300" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-bold text-slate-900">Log in to see your notifications</h2>
        <p className="mb-6 max-w-xs text-sm text-slate-500">
          Booking updates, offers, and reminders will show up here once you&apos;re logged in.
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="rounded-2xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-amber-500/90"
        >
          Go to profile
        </button>
      </div>
    );
  }

  // Was still `take`-limited going in, so a full page of results likely means
  // there's more — an approximation (the backend has no total count today),
  // good enough for a "Load more" affordance.
  const canLoadMore = notifications.length >= visibleCount;

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading && notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">Loading…</p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-14 text-center">
              <Bell className="mb-3 h-8 w-8 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm text-slate-500">
                Nothing here yet — booking updates and offers will show up as they happen.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} />
            ))
          )}
        </div>

        {canLoadMore && (
          <button
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Load more
          </button>
        )}
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
