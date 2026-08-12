"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { bookingApi, type AvailableSlot } from "@/src/services/bookingApi";
import type { CartItem } from "@/src/utils/types/cart";

type SlotPickerModalProps = {
  item: CartItem;
  zoneId: string | null;
  onClose: () => void;
  onConfirm: (slotDate: string, slotStartTime: string) => void;
};

const todayIso = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const formatSlotLabel = (slot: AvailableSlot) => `${slot.startTime} - ${slot.endTime}`;

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
      // Deferred, not called straight from the effect body — same pattern
      // used for the equivalent branch in AddressPicker (CartView.tsx) and
      // spa-booking/index.tsx's geolocation effect.
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

  const handleConfirm = () => {
    if (!selectedStartTime) return;
    onConfirm(selectedDate, selectedStartTime);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[80vh] w-[calc(100%-2rem)] max-w-sm flex-col gap-0 overflow-hidden rounded-[24px] border border-stone-100 bg-white p-0 shadow-2xl"
        showCloseButton={false}
      >
        <div className="flex items-center justify-between border-b border-[#F3EFEB] px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Select a time
            </p>
            <p className="truncate text-[13px] font-bold text-gray-900">
              {item.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <label className="block text-[11px] font-medium text-gray-500">
            Date
            <input
              type="date"
              min={todayIso()}
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setSelectedStartTime(null);
              }}
              className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-amber-400"
            />
          </label>

          {!canFetch ? (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {zoneId
                ? "This item is missing its service/duration details, so slots can't be loaded."
                : "Your service zone is unavailable — refresh your location and try again."}
            </p>
          ) : isLoading ? (
            <p className="py-6 text-center text-xs text-gray-400">
              Loading available slots…
            </p>
          ) : error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          ) : slots.length === 0 ? (
            <p className="py-6 text-center text-xs text-gray-400">
              No slots available on this date — try another day.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {slots.map((slot) => {
                const isAvailable = slot.netAvailable > 0;
                const isSelected = selectedStartTime === slot.startTime;
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSelectedStartTime(slot.startTime)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-semibold transition-colors ${
                      !isAvailable
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                        : isSelected
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-gray-200 text-gray-700 hover:border-amber-300"
                    }`}
                  >
                    <Clock className="h-3 w-3 shrink-0" />
                    {formatSlotLabel(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[#F3EFEB] p-4">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedStartTime}
            className="h-11 w-full rounded-xl bg-[#25180F] text-[13px] font-bold text-white disabled:opacity-40"
          >
            {selectedStartTime ? "Confirm slot" : "Choose a slot"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
