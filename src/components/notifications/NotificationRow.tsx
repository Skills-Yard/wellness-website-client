"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import type { NotificationItem } from "@/src/types/notification";
import { timeAgo } from "./timeAgo";

export default function NotificationRow({
  notification,
  onNavigate,
}: {
  notification: NotificationItem;
  /** Called right before navigating away (e.g. to close a dropdown panel). */
  onNavigate?: () => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.deeplink) return;
    onNavigate?.();
    router.push(notification.deeplink);
  };

  return (
    <div
      role={notification.deeplink ? "button" : undefined}
      tabIndex={notification.deeplink ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleClick();
      }}
      className={cn(
        "flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors",
        notification.deeplink && "cursor-pointer hover:bg-gray-50",
        !notification.isRead && "bg-amber-50/50",
      )}
    >
      <span
        className={cn(
          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
          notification.isRead ? "bg-transparent" : "bg-amber-500",
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm truncate",
            notification.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold",
          )}
        >
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.body}</p>
        <p className="text-[10px] text-gray-400 mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
    </div>
  );
}
