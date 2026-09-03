"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Back-button + title bar shared by every phone-only sub-screen (Settings,
 *  Personal Information, Addresses, ...) — matches the Figma "Profile"/
 *  "Settings"/etc. frames: a bordered square back button, bold 18px title. */
export function MobileScreenHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-4 flex items-center gap-3 bg-[#FAF8F4] px-4 pt-4 pb-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-espresso"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <h1 className="text-base font-semibold text-espresso">{title}</h1>
    </div>
  );
}

/** The 40x40 rounded icon chip every menu/settings row uses. */
export function IconBadge({ icon: Icon, className = "" }: { icon: LucideIcon; className?: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBF7ED]">
      <Icon className={`h-4 w-4 text-amber-600 ${className}`} />
    </span>
  );
}

/** A tappable list row — icon, label, and a trailing bit (chevron by
 *  default, or a custom node like "Light ›" / a Switch). Used by the Hub
 *  menu, Settings, and Help & Support's FAQ list. */
export function MenuRow({
  icon,
  label,
  trailing,
  onClick,
  danger = false,
  as: Tag = "button",
}: {
  icon: LucideIcon;
  label: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  as?: "button" | "div";
}) {
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <IconBadge icon={icon} className={danger ? "text-red-500" : undefined} />
        <span className={`truncate text-xs font-medium ${danger ? "text-red-500" : "text-espresso"}`}>
          {label}
        </span>
      </span>
      {trailing ?? <ChevronRight className="h-4.5 w-4.5 shrink-0 text-[#666]" />}
    </>
  );

  if (Tag === "div") {
    return <div className="flex items-center justify-between gap-3 px-3.5 py-3">{content}</div>;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
    >
      {content}
    </button>
  );
}

/** Groups MenuRows into one bordered white card with dividers, matching the
 *  Figma "Frame 70x" list container used on the Hub, Settings and Help
 *  screens. */
export function MenuCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="divide-y divide-black/[0.06] overflow-hidden rounded-lg border-[1.5px] border-black/[0.03] bg-white">
      {children}
    </div>
  );
}

/** Placeholder screen for menu items that don't have a feature behind them
 *  yet (Offers & Coupons, Refer & Earn, Privacy Policy, ...). Keeps the row
 *  visible and tappable rather than hiding it, per the "coming soon" plan. */
export function MobileComingSoon({
  title,
  icon: Icon,
  onBack,
}: {
  title: string;
  icon: LucideIcon;
  onBack: () => void;
}) {
  return (
    <div>
      <MobileScreenHeader title={title} onBack={onBack} />
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-black/10 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBF7ED] text-amber-600">
          <Icon className="h-6 w-6" />
        </span>
        <p className="text-xs font-semibold text-espresso">Coming soon</p>
        <p className="max-w-[240px] text-[11px] text-[#999]">
          {title} isn&apos;t available yet — we&apos;re working on it.
        </p>
      </div>
    </div>
  );
}
