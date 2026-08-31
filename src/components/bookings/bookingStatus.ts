import type { BookingStatus } from "@/src/types/booking";

type StatusMeta = {
  label: string;
  /** Tailwind classes for a small pill — bg + text, matching the amber/
   *  slate palette already used across cart/notifications components. */
  className: string;
};

const STATUS_META: Record<BookingStatus, StatusMeta> = {
  PENDING_PAYMENT: { label: "Payment Pending", className: "bg-slate-100 text-slate-600" },
  EXPIRED: { label: "Expired", className: "bg-slate-100 text-slate-500" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-50 text-blue-600" },
  BROADCASTED: { label: "Finding Your Partner", className: "bg-amber-50 text-amber-600" },
  ACCEPTED: { label: "Partner Assigned", className: "bg-blue-50 text-blue-600" },
  NO_PARTNER_FOUND: { label: "No Partner Found", className: "bg-red-50 text-red-600" },
  PARTNER_EN_ROUTE: { label: "Partner On The Way", className: "bg-amber-50 text-amber-600" },
  PARTNER_ARRIVED: { label: "Partner Arrived", className: "bg-amber-50 text-amber-600" },
  IN_PROGRESS: { label: "Service In Progress", className: "bg-emerald-50 text-emerald-600" },
  COMPLETED: { label: "Completed", className: "bg-emerald-50 text-emerald-700" },
  CANCELLED_BY_CLIENT: { label: "Cancelled", className: "bg-red-50 text-red-600" },
  CANCELLED_BY_PARTNER: { label: "Cancelled", className: "bg-red-50 text-red-600" },
  CANCELLED_BY_ADMIN: { label: "Cancelled", className: "bg-red-50 text-red-600" },
  PENDING_RESCHEDULE: { label: "Reschedule Pending", className: "bg-amber-50 text-amber-600" },
  RESCHEDULED: { label: "Rescheduled", className: "bg-blue-50 text-blue-600" },
  DISPUTED: { label: "Disputed", className: "bg-red-50 text-red-600" },
};

export const getStatusMeta = (status: BookingStatus): StatusMeta =>
  STATUS_META[status] ?? { label: status, className: "bg-slate-100 text-slate-600" };

/** `next/image` throws if `src` isn't an absolute URL or a root-relative
 *  path. Unlike catalog `thumbnailKey` (already resolved to a full URL by
 *  the backend before it reaches serviceItemApi — see category-services/
 *  index.tsx), the client-facing booking payload returns `partner.
 *  profilePhotoKey`/`serviceItem.thumbnailKey` un-resolved raw storage
 *  keys (e.g. "partners/abc123.jpg"), so those can't be trusted as-is.
 *  Falls back to null (render the placeholder icon instead) for anything
 *  that isn't already a usable src. */
export const resolveImageSrc = (key?: string | null): string | null =>
  key && (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/"))
    ? key
    : null;

/** Same "no /100 division" convention as formatPrice in
 *  category-services/index.tsx — booking money fields are plain rupee
 *  integers, not paise (see src/types/booking.ts's file-level note). */
export const formatBookingAmount = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export const formatBookingDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Longer variant with weekday, e.g. "Sat, 01 June 2026" — used on the
 *  bookings list where the card has room for it. */
export const formatBookingDateLong = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/** `scheduledTime` comes back as a bare "HH:mm" string, not a full
 *  timestamp — format it into a friendly 12-hour label without going
 *  through Date parsing (which would need a fabricated date component). */
export const formatBookingTime = (time: string) => {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  if (Number.isNaN(hour)) return time;
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minuteStr} ${period}`;
};

export const isCancellableStatus = (status: BookingStatus) =>
  !["COMPLETED", "CANCELLED_BY_CLIENT", "CANCELLED_BY_PARTNER", "CANCELLED_BY_ADMIN", "EXPIRED"].includes(
    status,
  );

export const isDisputableStatus = (status: BookingStatus) =>
  status === "COMPLETED" || status === "IN_PROGRESS";

/** Mirrors BookingService.RESCHEDULABLE_STATUSES on the backend — kept in
 *  sync manually since there's no shared types package with the backend.
 *  The server additionally enforces a reschedule-cutoff window, a max
 *  reschedule count, and that the booking isn't ON_DEMAND; those are left
 *  to surface as server error messages rather than duplicated here. */
export const isRescheduleStatus = (status: BookingStatus) =>
  status === "CONFIRMED" ||
  status === "ACCEPTED" ||
  status === "PARTNER_EN_ROUTE" ||
  status === "PARTNER_ARRIVED";
