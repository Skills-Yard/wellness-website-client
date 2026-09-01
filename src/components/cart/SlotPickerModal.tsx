"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Calendar, ChevronRight, X } from "lucide-react";
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

// Slot times come back as bare "HH:mm" — but pass any already-12h string
// straight through so it isn't mangled by formatBookingTime.
const to12h = (t: string) => (/[ap]m/i.test(t) ? t : formatBookingTime(t));

export default function SlotPickerModal({
  item,
  zoneId,
  onClose,
  onConfirm,
}: SlotPickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(item.slotDate || todayIso());
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    item.slotDate === selectedDate ? (item.slotStartTime ?? null) : null,
  );
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    onConfirm(selectedDate, selectedStartTime);
    onClose();
  };

  // Only the next 4 days get their own chip — anything further out is a
  // calendar pick away (the "More Dates" tile / the "Can't find a
  // suitable date?" hint), rather than scrolling through a longer row.
  const days = nextDays(4);
  const dayList = days.some((d) => d.iso === selectedDate)
    ? days
    : [dayChip(new Date(`${selectedDate}T00:00:00`)), ...days];

  const activeSlot = slots.find((s) => s.startTime === selectedStartTime);
  const rangeLabel = activeSlot
    ? `${to12h(activeSlot.startTime)} - ${to12h(activeSlot.endTime)}`
    : item.slotStartTime && item.slotDate === selectedDate
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
        className="top-0 left-0 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-white p-0 ring-0 sm:max-w-none md:top-1/2 md:left-1/2 md:h-auto md:max-h-[85vh] md:w-full md:max-w-4xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border md:border-slate-100 md:shadow-2xl"
      >
      <div className="flex items-center justify-between gap-3 px-4 pt-5 pb-3 md:px-8 md:pt-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[#EDEDED] text-black transition-colors hover:bg-stone-50 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-black">Select Date &amp; Time</h1>
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
        <div className="flex shrink-0 gap-3 rounded-lg border border-black/5 p-3 shadow-[3px_2px_16px_rgba(0,0,0,0.04)]">
          <div className="relative h-21.5 w-29.75 shrink-0 overflow-hidden rounded-lg bg-stone-100">
            <Image src={item.image} alt={item.title} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="truncate text-sm font-medium text-black">{item.title}</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#25180F]">
              {rangeLabel}
              <span className="h-1 w-1 rounded-full bg-[#666]" />
              <span className="text-[#666]">At home</span>
            </p>
            <p className="mt-1.5 text-sm font-medium text-[#D38516]">{longDate}</p>
          </div>
        </div>

        {/* md:grid — side-by-side Date/Time columns from md: up (see the
            image); below md: this is a flex-col instead (Select Date
            fixed on top, Select Time — heading fixed, only its list
            scrolls — filling the rest of the popup's height beneath it).
            The date column is a fixed 400px, not an even 1fr/1fr split —
            it needs a hard minimum (5 chips × 64px + 4 × 12px gaps =
            368px) to show all 4 dates + "More Dates" without clipping/
            scrolling, which a 50/50 split couldn't guarantee at every
            popup width. Select Time has no such fixed requirement (its
            rows are just full-width buttons), so minmax(0,1fr) lets it
            take whatever's left and still shrink safely instead of
            overflowing. items-stretch (not items-start) so the Select
            Time column actually gets a real height to scroll within,
            matching this row's own height instead of shrinking to its
            (short) sibling's content height. */}
        <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[400px_minmax(0,1fr)] md:items-stretch md:gap-6">
          <div className="shrink-0">
            <h2 className="mt-6 mb-3 text-base font-medium text-black">Select Date</h2>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {dayList.map((d) => {
                const selected = d.iso === selectedDate;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => pickDate(d.iso)}
                    className={`flex h-25.75 w-16 shrink-0 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95 ${
                      selected
                        ? "bg-[#25180F] text-white hover:bg-[#3a2518]"
                        : "border border-black/5 bg-[#FBF7ED] text-[#25180F] hover:border-[#D38516]/40 hover:bg-[#F7EBD3]"
                    }`}
                  >
                    <span>{d.weekday}</span>
                    <span className="text-xl">{d.day}</span>
                    <span>{d.month}</span>
                  </button>
                );
              })}

              <label className="relative flex h-25.75 w-16 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-black/5 bg-[#FBF7ED] text-center text-xs font-medium text-[#25180F] transition-colors duration-150 hover:border-[#D38516]/40 hover:bg-[#F7EBD3] active:scale-95">
                <Calendar className="h-8 w-8 text-[#D38516]" />
                More Dates
                {/* A plain click on a date input doesn't reliably pop the
                    native calendar open in every browser — showPicker()
                    forces it open on the same click instead of depending
                    on that default behavior. */}
                <input
                  type="date"
                  min={todayIso()}
                  value={selectedDate}
                  onClick={(event) => event.currentTarget.showPicker?.()}
                  onChange={(event) => event.target.value && pickDate(event.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>

            {/* Desktop-only hint, matching the reference design — the
                "More Dates" tile above already covers this on mobile, so
                it isn't duplicated there. */}
            <label className="relative mt-6 hidden cursor-pointer items-center gap-3 rounded-xl bg-[#FBF1E0] px-4 py-3.5 transition-colors hover:bg-[#F7E8CE] md:flex">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#D38516]">
                <Calendar className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-black">
                  Can&apos;t find a suitable date?
                </span>
                <span className="block text-xs text-[#666]">
                  Check availability for more dates that suit you.
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#D38516]" />
              {/* Same overlay + showPicker() as the "More Dates" input above. */}
              <input
                type="date"
                min={todayIso()}
                value={selectedDate}
                onClick={(event) => event.currentTarget.showPicker?.()}
                onChange={(event) => event.target.value && pickDate(event.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </div>

          {/* Select Time — heading stays fixed (shrink-0), only the
              status/slots content below it scrolls, within whatever
              height md:items-stretch (desktop) or the flex-1 chain
              (mobile) actually gives this column. */}
          <div className="flex min-h-0 flex-1 flex-col md:h-full">
            <h2 className="mt-6 mb-3 shrink-0 text-base font-medium text-black">Select Time</h2>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {!canFetch ? (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {zoneId
                    ? "This item is missing its service/duration details, so slots can't be loaded."
                    : "Your service zone is unavailable — refresh your location and try again."}
                </p>
              ) : isLoading ? (
                <p className="py-6 text-center text-xs text-gray-400">Loading available slots…</p>
              ) : error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
              ) : slots.length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-400">
                  No slots available on this date — try another day.
                </p>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => {
                    const isAvailable = slot.netAvailable > 0;
                    const isSelected = selectedStartTime === slot.startTime;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedStartTime(slot.startTime)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-4 text-left transition-all duration-150 ${
                          isSelected
                            ? "border-[#D38516]/40 bg-[radial-gradient(120%_120%_at_60%_0%,#FDE8CF_0%,rgba(255,226,173,0)_60%,#FDE8CF_100%)]"
                            : "border-black/8 bg-white"
                        } ${
                          isAvailable
                            ? "cursor-pointer hover:border-[#D38516]/40 hover:bg-[#FFFBF3] active:scale-[0.98]"
                            : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border-2 ${
                              isSelected ? "border-[#D38516]" : "border-black/30"
                            }`}
                          >
                            {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[#D38516]" />}
                          </span>
                          <span className="text-sm font-medium text-black">
                            {to12h(slot.startTime)} - {to12h(slot.endTime)}
                          </span>
                        </span>
                        <span
                          className={`text-xs font-medium ${
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

      <div className="border-t border-black/6 p-4 md:px-8 md:py-5">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedStartTime}
          className="relative w-full cursor-pointer rounded-lg bg-[#25180F] py-3.5 text-sm font-medium text-white transition-all duration-150 hover:bg-[#3a2518] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:opacity-100 disabled:active:scale-100 md:text-base"
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
