"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  ChevronDown,
  Headset,
  ShieldCheck,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { bookingApi, type AvailableSlot } from "@/src/services/bookingApi";
import { formatBookingTime } from "@/src/components/bookings/bookingStatus";
import type { CartItem } from "@/src/utils/types/cart";

type SlotPickerModalProps = {
  item: CartItem;
  zoneId: string | null;
  onClose: () => void;
  onConfirm: (slotDate: string, slotStartTime: string) => void;
};

type DayChip = { iso: string; weekday: string; day: string; month: string };

const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const todayIso = () => isoOf(new Date());

// A cart slot date reaches us in one of two shapes: the bare
// "YYYY-MM-DD" this modal writes, or — once the cart has re-synced with
// the server — a full ISO timestamp like "2026-09-02T00:00:00.000Z".
// Everything below works off the bare calendar date, so collapse both
// forms to that here (an unparseable value falls back to today).
const toCalendarIso = (value?: string | null): string => {
  if (!value) return todayIso();
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? todayIso() : isoOf(parsed);
};

const dayChip = (d: Date): DayChip => ({
  iso: isoOf(d),
  weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
  day: String(d.getDate()),
  month: d.toLocaleDateString("en-IN", { month: "short" }),
});

const nextDays = (count: number) => {
  const base = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return dayChip(d);
  });
};

const addDays = (base: Date, n: number) => {
  const d = new Date(base);
  d.setDate(base.getDate() + n);
  return d;
};

// Slot times come back as bare "HH:mm" — but pass any already-12h string
// straight through so it isn't mangled by formatBookingTime.
const to12h = (t: string) => (/[ap]m/i.test(t) ? t : formatBookingTime(t));

// Resolve a slot's start ("HH:mm", or an already-12h "h:mm am/pm") to an
// absolute Date on the given day so it can be compared against "now".
const slotDateTime = (dateIso: string, time: string): Date | null => {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*([ap]m)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  const d = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// A slot stops being bookable once its start is less than an hour away.
const BOOKING_LEAD_MS = 60 * 60 * 1000;

// How far out dates can be picked. The first chipCount days are chips;
// the rest live in the "More dates" dropdown.
const BOOKING_WINDOW_DAYS = 7;

// Static reassurance list shown in the leftover space under the date
// chips (desktop only — mobile has no such gap).
const ASSURANCES = [
  {
    Icon: Award,
    title: "Professional & verified expert",
    desc: "Trained and experienced professionals.",
  },
  {
    Icon: ShieldCheck,
    title: "Hygiene & safety assured",
    desc: "Clean tools, sanitized kits, safe service.",
  },
  {
    Icon: Headset,
    title: "At your convenience",
    desc: "Service at your location, on your time.",
  },
];

export default function SlotPickerModal({
  item,
  zoneId,
  onClose,
  onConfirm,
}: SlotPickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(() => toCalendarIso(item.slotDate));
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    item.slotStartTime ?? null,
  );
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  // Mobile shows 3 date chips (+ next 4 in the More-dates dropdown); md:
  // up shows 4 (+ next 3). This modal is client-only (ssr:false in
  // CartView) so the initializer can safely read matchMedia — no
  // hydration flash.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window === "undefined" || window.matchMedia("(min-width: 768px)").matches,
  );

  // Keep the "has this slot expired?" checks live while the modal is open.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!dateMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDateMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dateMenuOpen]);

  const canFetch = Boolean(item.serviceItemId && item.durationId && zoneId);

  useEffect(() => {
    if (!canFetch) return;
    let isMounted = true;
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      queueMicrotask(() => {
        if (isMounted) setError("Please log in to see available slots.");
      });
      return () => {
        isMounted = false;
      };
    }

    queueMicrotask(() => {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
    });

    bookingApi
      .getAvailableSlots(
        {
          serviceItemId: item.serviceItemId!,
          durationId: item.durationId!,
          zoneId: zoneId!,
          date: selectedDate,
        },
        accessToken,
      )
      .then((response) => {
        if (!isMounted) return;
        setSlots(response.data ?? []);
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setSlots([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load slots for this date.",
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [canFetch, item.serviceItemId, item.durationId, zoneId, selectedDate]);

  const pickDate = (iso: string) => {
    setSelectedDate(iso);
    setSelectedStartTime(null);
  };

  const handleConfirm = () => {
    if (!selectedStartTime) return;
    const picked = slots.find((s) => s.startTime === selectedStartTime);
    if (picked && isSlotExpired(picked)) return;
    onConfirm(selectedDate, selectedStartTime);
    onClose();
  };

  // Only the first few days get their own chip (4 on desktop, 3 on
  // mobile). The rest of the 7-day booking window lives in the "More
  // dates" dropdown on the last tile — 3 entries on desktop, 4 on
  // mobile. Picking one doesn't append a chip: the More tile itself
  // shows that date (styled as the dropdown control).
  const chipCount = isDesktop ? 4 : 3;
  const dayList = nextDays(chipCount);
  const moreDates = Array.from({ length: BOOKING_WINDOW_DAYS - chipCount }, (_, i) =>
    dayChip(addDays(new Date(), chipCount + i)),
  );
  const customDate = dayList.some((d) => d.iso === selectedDate)
    ? null
    : dayChip(new Date(`${selectedDate}T00:00:00`));

  const isSelectedDateToday = selectedDate === todayIso();
  const bookingCutoff = now.getTime() + BOOKING_LEAD_MS;
  const isSlotExpired = (slot: AvailableSlot) => {
    if (!isSelectedDateToday) return false;
    const start = slotDateTime(selectedDate, slot.startTime);
    return start != null && start.getTime() <= bookingCutoff;
  };

  // Expired slots (start already within the next hour) are dropped from
  // the list entirely rather than shown disabled.
  const visibleSlots = slots.filter((slot) => !isSlotExpired(slot));

  const activeSlot = slots.find((s) => s.startTime === selectedStartTime);
  const activeSlotExpired = activeSlot ? isSlotExpired(activeSlot) : false;
  const rangeLabel = activeSlot
    ? `${to12h(activeSlot.startTime)} - ${to12h(activeSlot.endTime)}`
    : item.slotStartTime && toCalendarIso(item.slotDate) === selectedDate
      ? to12h(item.slotStartTime)
      : "Choose a time";
  const longDate = (() => {
    const d = new Date(`${selectedDate}T00:00:00`);
    return Number.isNaN(d.getTime())
      ? selectedDate
      : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  })();

  // A nested Radix Dialog, not a bare portal: rendered from inside the
  // modal cart Sheet, which freezes document.body with `pointer-events:
  // none` — anything portaled straight to <body> (as this was) inherits
  // that and can't be clicked. Radix's own layer re-enables pointer events
  // on its content and stacks correctly on top of the Sheet.
  //
  // Full-bleed "page" look below md: (unchanged); from md: up this
  // switches to a normal centered dialog (re-enabling Radix's own
  // top-1/2/left-1/2/-translate-1/2 centering, capped width, rounded on
  // every corner) instead of staying pinned full-screen on desktop/tablet.
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-white p-0 ring-0 sm:max-w-none md:top-1/2 md:left-1/2 md:h-[85vh] md:max-h-184 md:w-full md:max-w-4xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border md:border-slate-100 md:shadow-2xl"
      >
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2 md:px-8 md:pt-6 md:pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#EDEDED] text-black transition-colors hover:bg-stone-50 active:scale-95 md:h-8 md:w-8"
          >
            <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-black md:text-xl">Select Date &amp; Time</h1>
            {/* Desktop-only subtitle — mobile keeps the original single-line header. */}
            <p className="mt-1 hidden text-sm text-gray-500 md:block">
              Choose your preferred slot to continue
            </p>
          </div>
        </div>
        {/* Desktop-only close button — mobile relies on the back arrow above. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="hidden h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#EDEDED] text-black transition-colors hover:bg-stone-50 active:scale-95 md:flex"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* min-h-0 on every level of this flex-col chain (down to the
          slots-list div at the very bottom) is what makes only the Select
          Time *list* scroll — a flex/grid item defaults to
          min-height:auto, which lets it grow to fit its content instead of
          respecting the flex-1 share it was actually given, and that's
          what used to make the whole body one shared scroll area (or, if
          skipped anywhere in the chain, would silently break the split
          again). The service card and Select Date section are shrink-0:
          fixed at their natural size, never scrolling. */}
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 md:px-8 md:pb-6">
        <div className="flex shrink-0 gap-2.5 rounded-lg border border-black/5 p-2.5 shadow-[3px_2px_16px_rgba(0,0,0,0.04)] md:gap-3 md:p-3">
          <div className="relative h-16 w-22 shrink-0 overflow-hidden rounded-lg bg-stone-100 md:h-21.5 md:w-29.75">
            <Image src={item.image} alt={item.title} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5 md:pt-1">
            <p className="truncate text-xs font-medium text-black md:text-sm">{item.title}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#25180F] md:mt-1.5 md:text-xs">
              {rangeLabel}
              <span className="h-1 w-1 rounded-full bg-[#666]" />
              <span className="text-[#666]">At home</span>
            </p>
            <p className="mt-1 text-xs font-medium text-[#D38516] md:mt-1.5 md:text-sm">{longDate}</p>
          </div>
        </div>

        {/* md:grid — side-by-side Date/Time columns from md: up (see the
            image); below md: this is a flex-col instead (Select Date
            fixed on top, Select Time — heading fixed, only its list
            scrolls — filling the rest of the popup's height beneath it).
            The date column needs a hard minimum (5 tiles × 64px + 4 ×
            12px gaps = 368px) to show all 4 dates + "More Dates" without
            clipping — 400px on lg:, a tighter 340px on md: (tablet) where
            the row will scroll horizontally if it must. Select Time takes
            whatever's left via minmax(0,1fr).
            grid-template-rows:minmax(0,1fr) + items-stretch pins the row
            to the popup's fixed inner height, so the Select Time list
            scrolls within it and the popup height never grows with the
            slot count. The Select Date column itself never scrolls — the
            reassurance block below the chips only renders when the
            viewport is tall enough to show all of it (see its variant),
            so the column always fits as-is. */}
        <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[340px_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)] md:items-stretch md:gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
          <div className="shrink-0">
            <h2 className="mt-4 mb-2 text-sm font-medium text-black md:mt-6 md:mb-3 md:text-base">Select Date</h2>
            {/* relative wrapper: the dropdown is a sibling of the chip
                row (not inside it), so md:overflow-x-auto on the row
                can't clip it. Mobile: 3 chips + the More tile share the
                row full-width (flex-1, no scroll) so they fit any phone;
                md: up they revert to a fixed 64px width and scroll if the
                column can't hold all 5. */}
            <div className="relative">
              <div className="flex gap-2 pb-1 md:gap-3 md:overflow-x-auto">
                {dayList.map((d) => {
                  const selected = d.iso === selectedDate;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => pickDate(d.iso)}
                      className={`flex h-22 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 md:h-25.75 md:w-16 md:flex-none md:gap-2.5 md:text-sm ${
                        selected
                          ? "bg-[#25180F] text-white hover:bg-[#3a2518]"
                          : "border border-black/5 bg-[#FBF7ED] text-[#25180F] hover:border-[#D38516]/40 hover:bg-[#F7EBD3]"
                      }`}
                    >
                      <span>{d.weekday}</span>
                      <span className="text-lg md:text-xl">{d.day}</span>
                      <span>{d.month}</span>
                    </button>
                  );
                })}

                {/* "More dates" tile — toggles a dropdown of just the
                    remaining bookable dates (no full native calendar with
                    everything-else disabled). Once one is picked
                    (customDate set) this tile shows that date, dashed
                    amber, with a "More" caption so it still reads as the
                    dropdown control. */}
                <button
                  type="button"
                  onClick={() => setDateMenuOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={dateMenuOpen}
                  className={`relative flex h-22 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-center text-[11px] font-medium transition-colors duration-150 active:scale-95 md:h-25.75 md:w-16 md:flex-none md:text-xs ${
                    customDate
                      ? "border-2 border-dashed border-[#D38516] bg-[#25180F] text-white"
                      : "border border-black/5 bg-[#FBF7ED] text-[#25180F] hover:border-[#D38516]/40 hover:bg-[#F7EBD3]"
                  } ${dateMenuOpen ? "ring-2 ring-[#D38516]/40" : ""}`}
                >
                  {customDate ? (
                    <>
                      <span>{customDate.weekday}</span>
                      <span className="text-lg font-semibold md:text-xl">{customDate.day}</span>
                      <span>{customDate.month}</span>
                      <span className="-mt-1 flex items-center gap-0.5 text-[10px] text-[#F0B860]">
                        <ChevronDown className="h-3 w-3" />
                        More
                      </span>
                    </>
                  ) : (
                    <>
                      <Calendar className="h-6 w-6 text-[#D38516] md:h-8 md:w-8" />
                      More Dates
                    </>
                  )}
                </button>
              </div>

              {dateMenuOpen && (
                <>
                  {/* click-anywhere-else backdrop (no portal / listeners) */}
                  <button
                    type="button"
                    aria-label="Close date list"
                    onClick={() => setDateMenuOpen(false)}
                    className="fixed inset-0 z-20 cursor-default"
                  />
                  <div
                    role="listbox"
                    aria-label="More dates"
                    className="absolute top-full right-0 z-30 mt-2 w-60 overflow-hidden rounded-xl border border-black/10 bg-white p-1 shadow-xl"
                  >
                    <p className="px-3 py-2 text-[11px] font-medium tracking-wide text-[#999] uppercase">
                      More dates
                    </p>
                    {moreDates.map((md) => {
                      const active = md.iso === selectedDate;
                      const full = new Date(`${md.iso}T00:00:00`).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                      return (
                        <button
                          key={md.iso}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            pickDate(md.iso);
                            setDateMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
                            active
                              ? "bg-[#FBF1E0] text-[#25180F]"
                              : "text-[#25180F] hover:bg-[#F7EBD3]"
                          }`}
                        >
                          <span className="flex flex-col">
                            <span className="text-[11px] text-[#888]">{md.weekday}</span>
                            <span className="text-sm font-medium">{full}</span>
                          </span>
                          {active && <span className="h-2 w-2 shrink-0 rounded-full bg-[#D38516]" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Fills the space under the chips — but only on a wide (md:)
                AND tall (>=850px) viewport, so it's shown in full or not
                at all and the Select Date column never needs to scroll.
                Below that height it's dropped entirely. */}
            <div className="mt-5 hidden rounded-xl bg-[#FBF7ED] px-4 [@media(min-width:768px)_and_(min-height:850px)]:block">
              {ASSURANCES.map(({ Icon, title, desc }, i) => (
                <div
                  key={title}
                  className={`flex items-center gap-3 py-3.5 ${
                    i > 0 ? "border-t border-black/5" : ""
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#D38516]">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-black">{title}</span>
                    <span className="block text-xs text-[#666]">{desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Select Time — heading stays fixed (shrink-0), only the
              status/slots list below it scrolls. The column is pinned to
              the popup's inner height by the grid row, so the list
              scrolls within it and never stretches the popup. */}
          <div className="mt-3 flex min-h-0 flex-1 flex-col md:mt-0 md:h-full">
            <h2 className="mb-2 shrink-0 text-sm font-medium text-black md:mt-6 md:mb-3 md:text-base">Select Time</h2>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {!canFetch ? (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {zoneId
                    ? "This item is missing its service/duration details, so slots can't be loaded."
                    : "Your service zone is unavailable — refresh your location and try again."}
                </p>
              ) : isLoading ? (
                <p className="py-4 text-center text-xs text-gray-400 md:py-6">Loading available slots…</p>
              ) : error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
              ) : visibleSlots.length === 0 ? (
                <p className="py-4 text-center text-xs text-gray-400 md:py-6">
                  {slots.length === 0
                    ? "No slots available on this date — try another day."
                    : "No more slots available today — try another day."}
                </p>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {visibleSlots.map((slot) => {
                    const isAvailable = slot.netAvailable > 0;
                    const isSelected = selectedStartTime === slot.startTime;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedStartTime(slot.startTime)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all duration-150 md:px-3.5 md:py-4 ${
                          isSelected
                            ? "border-[#D38516]/40 bg-[radial-gradient(120%_120%_at_60%_0%,#FDE8CF_0%,rgba(255,226,173,0)_60%,#FDE8CF_100%)]"
                            : "border-black/8 bg-white"
                        } ${
                          isAvailable
                            ? "cursor-pointer hover:border-[#D38516]/40 hover:bg-[#FFFBF3] active:scale-[0.98]"
                            : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 md:gap-3">
                          <span
                            className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 md:h-5.5 md:w-5.5 ${
                              isSelected ? "border-[#D38516]" : "border-black/30"
                            }`}
                          >
                            {isSelected && <span className="h-2 w-2 rounded-full bg-[#D38516] md:h-2.5 md:w-2.5" />}
                          </span>
                          <span className="text-xs font-medium text-black md:text-sm">
                            {to12h(slot.startTime)} - {to12h(slot.endTime)}
                          </span>
                        </span>
                        <span
                          className={`text-[11px] font-medium md:text-xs ${
                            isAvailable ? "text-[#208900]" : "text-gray-400"
                          }`}
                        >
                          {isAvailable ? "Available" : "Full"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/6 p-3 md:px-8 md:py-5">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedStartTime || activeSlotExpired}
          className="relative w-full cursor-pointer rounded-lg bg-[#25180F] py-3 text-[13px] font-medium text-white transition-all duration-150 hover:bg-[#3a2518] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:opacity-100 disabled:active:scale-100 md:py-3.5 md:text-base"
        >
          Confirm Time Slot
          {/* Desktop-only trailing arrow, matching the reference design. */}
          <ArrowRight className="absolute right-6 top-1/2 hidden h-5 w-5 -translate-y-1/2 md:block" />
        </button>
      </div>
      </DialogContent>
    </Dialog>
  );
}
