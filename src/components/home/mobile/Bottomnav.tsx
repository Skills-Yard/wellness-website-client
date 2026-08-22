"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useUnreadNotificationCount } from "@/src/hooks/queries/useNotifications";
import { NAV_LINK_SECTION_IDS } from "@/src/utils/data";

interface BottomNavProps {
  activeTab: string;
  onTabClick: (id: string) => void;
}

export default function BottomNav({ activeTab, onTabClick }: BottomNavProps) {
  // No-ops (query stays disabled) when logged out — see useUnreadNotificationCount.
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const navItems = [
    { id: "top", label: "Home", icon: "/icon/Home.png", color: "amber" },
    { id: NAV_LINK_SECTION_IDS.Wellness, label: "Spa", icon: "/icon/spa.png", color: "emerald" },
    { id: NAV_LINK_SECTION_IDS.Massage, label: "Massage", icon: "/icon/Massage.png", color: "rose" },
    { id: NAV_LINK_SECTION_IDS.Physiotherapy, label: "Physio", icon: "/icon/Physio.png", color: "blue" },
  ];

  const colorMap = {
    amber: { active: "bg-amber-500", inactive: "bg-stone-400" },
    emerald: { active: "bg-amber-500", inactive: "bg-stone-400" },
    blue: { active: "bg-amber-500", inactive: "bg-stone-400" },
    rose: { active: "bg-amber-500", inactive: "bg-stone-400" },
  };

  const textColorMap = {
    amber: { active: "text-amber-500", inactive: "text-stone-400" },
    emerald: { active: "text-amber-500", inactive: "text-stone-400" },
    blue: { active: "text-amber-500", inactive: "text-stone-400" },
    rose: { active: "text-amber-500", inactive: "text-stone-400" },
  };

  return (
    <nav className="fixed w-[95%] shadow mx-auto bottom-3 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-100 flex justify-around py-2.5 px-1 rounded-3xl">
      {navItems.map(({ id, label, icon, color }) => {
        const isActive =
          id === "top" ? activeTab === "top" || activeTab === "home" : activeTab === id;

        const c = colorMap[color as keyof typeof colorMap];
        const t = textColorMap[color as keyof typeof textColorMap];

        return (
          <button
            key={id}
            onClick={() => onTabClick(id)}
            className={cn(
              "flex flex-col items-center gap-1 flex-1 py-1 transition-colors duration-200 cursor-pointer active:scale-90",
              isActive ? t.active : t.inactive,
            )}
            type="button"
            aria-label={label}
          >
            <span
              className={cn("w-4.5 h-4.5 transition-colors duration-200", isActive ? c.active : c.inactive)}
              style={{
                WebkitMaskImage: `url(${icon})`,
                maskImage: `url(${icon})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
            <span className="text-[9px] font-bold">{label}</span>
          </button>
        );
      })}

      <Link
        href="/profile"
        className={cn(
          "flex flex-col items-center gap-1 flex-1 py-1 transition-colors duration-200 cursor-pointer active:scale-90",
          activeTab === "profile" ? "text-amber-500" : "text-stone-400",
        )}
      >
        <span className="relative">
          <span
            className={cn("w-4.5 h-4.5 transition-colors duration-200", activeTab === "profile" ? "bg-amber-500" : "bg-stone-400")}
            style={{
              WebkitMaskImage: `url(/icon/Profile.png)`,
              maskImage: `url(/icon/Profile.png)`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          {/* Unseen-notification highlight — full bell + list live at /profile/notifications. */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
          )}
        </span>
        <span className="text-[9px] font-bold">Profile</span>
      </Link>
    </nav>
  );
}