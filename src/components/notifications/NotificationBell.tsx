"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import {
  useMarkAllNotificationsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/src/hooks/queries/useNotifications";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import NotificationRow from "./NotificationRow";

/** Bell + unread badge. Pass `isLoggedIn` when the parent already tracks it
 *  (e.g. Navbar); omit it anywhere else and the bell figures it out itself
 *  via useAuthStatus, which — unlike a one-time localStorage read on mount —
 *  stays correct if login/logout happens elsewhere while this is mounted.
 *
 *  Opening the panel is treated as "seeing" the notifications — it marks
 *  everything currently unread as read, clearing the highlight, while the
 *  list stays browsable (now all read) for as long as the user wants to
 *  revisit it. */
export default function NotificationBell({
  isLoggedIn: isLoggedInProp,
  className,
}: {
  isLoggedIn?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { isLoggedIn: selfDetectedLoggedIn } = useAuthStatus();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: notifications = [], isLoading } = useNotifications(20);
  const markAllRead = useMarkAllNotificationsRead();
  const hasUnread = unreadCount > 0;
  const isLoggedIn = isLoggedInProp ?? selfDetectedLoggedIn;

  if (!isLoggedIn) return null;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next && hasUnread && !markAllRead.isPending) markAllRead.mutate();
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={hasUnread ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className={cn(
            "relative w-9 h-9 rounded-xl cursor-pointer transition-colors",
            hasUnread
              ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
              : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-800",
            className,
          )}
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="flex w-80 max-h-[70vh] flex-col overflow-hidden rounded-2xl border-gray-100 bg-white p-0 shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3">
          <span className="text-sm font-bold text-gray-900">Notifications</span>
          {isLoading && <span className="text-[10px] text-gray-400">Loading…</span>}
        </div>

        <div className="flex-1 overflow-y-auto">
          {!isLoading && notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-400">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onNavigate={() => setOpen(false)}
              />
            ))
          )}
        </div>

        <Link
          href="/profile/notifications"
          onClick={() => setOpen(false)}
          className="block cursor-pointer border-t border-gray-50 px-4 py-3 text-center text-xs font-bold text-amber-600 hover:bg-amber-50"
        >
          View all
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
