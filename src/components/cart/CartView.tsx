"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Calendar,
  ChevronRight,
  Clock,
  Loader2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import type { Address, CreateAddressBody } from "@/src/services/addressApi";
import { AddressPicker } from "@/src/components/addresses/AddressPicker";
import { formatBookingTime } from "@/src/components/bookings/bookingStatus";

// Only rendered after "Change"/"Select" is tapped on a synced cart item.
const SlotPickerModal = dynamic(() => import("./SlotPickerModal"), {
  ssr: false,
  loading: () => null,
});

type AddressInput = Omit<CreateAddressBody, "userId">;
type Props = {
  address: Address | null;
  addresses: Address[];
  addressError: string | null;
  isAddressFormOpen: boolean;
  isSavingAddress: boolean;
  isCheckingOut: boolean;
  paymentError: string | null;
  onToggleAddressForm: () => void;
  onSelectAddress: (address: Address) => void;
  onCreateAddress: (address: AddressInput) => void;
  onUpdateAddress: (addressId: string, address: AddressInput) => void;
  onContinue: () => void;
};

const formatAddress = (a: Address) =>
  [a.line1, a.line2, a.landmark, a.city, a.state, a.pincode].filter(Boolean).join(", ");

const addressLabel = (a: Address) =>
  a.customLabel?.trim() || a.label || "Address";

// `formatBookingTime` expects a bare "HH:mm" — pass through anything that
// already carries an am/pm marker so a 12-hour slot string isn't mangled.
const to12h = (t: string) => (/[ap]m/i.test(t) ? t : formatBookingTime(t));

const durationMinutes = (duration: string) => {
  const n = parseInt(duration, 10);
  return Number.isFinite(n) ? n : 60;
};

const addMinutes = (hhmm: string, mins: number) => {
  const [h, m] = hhmm.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return hhmm;
  const total = h * 60 + m + mins;
  return `${String(Math.floor((total % 1440) / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

const slotTimeRange = (start: string, duration: string) =>
  `${to12h(start)} - ${to12h(addMinutes(start, durationMinutes(duration)))}`;

const slotDateLabel = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${date}, ${d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase()}`;
};

const CARD = "rounded-lg border border-black/5 bg-white shadow-[3px_2px_16px_rgba(0,0,0,0.04)]";

export default function CartView({
  address,
  addresses,
  addressError,
  isAddressFormOpen,
  isSavingAddress,
  isCheckingOut,
  paymentError,
  onToggleAddressForm,
  onSelectAddress,
  onCreateAddress,
  onUpdateAddress,
  onContinue,
}: Props) {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    couponCode,
    updateCartSchedule,
    cartZoneId,
    updateItemSlot,
    isUpdatingSlot,
    isCartSyncing,
  } = useCart();

  // Slot discovery is scoped to the cart's own zone (follows the selected
  // address), not the ambient browsing zone — see the original note that
  // moved this off `zoneId`.
  const slotPickerZoneId = cartZoneId;
  const [slotPickerItemId, setSlotPickerItemId] = useState<string | null>(null);
  const slotPickerItem = cartItems.find((item) => item.id === slotPickerItemId) ?? null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 pb-4">
        <h2 className="text-xl font-semibold text-black">My Cart</h2>
        {isCartSyncing && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating…
          </span>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-2 pr-0.5">
        {cartItems.map((item) => (
          <div key={item.id} className={CARD}>
            <div className="flex gap-3 p-3">
              <div className="relative h-21.5 w-29.75 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>

              <div className="flex min-h-21.5 min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="truncate text-sm font-medium text-black">{item.title}</h4>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    disabled={isCartSyncing}
                    aria-label="Remove item"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/15 text-[#666] hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#666]">
                  {item.duration}
                  <span className="h-1 w-1 rounded-full bg-[#666]" />
                  At home
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-black">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                  <div className="flex items-center overflow-hidden rounded-md border-[3px] border-black/4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity <= 1 || isCartSyncing}
                      aria-label="Decrease quantity"
                      className="flex h-7 w-7 items-center justify-center bg-[#F6F2EC] text-[#AA9778] disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="flex h-7 w-8 items-center justify-center bg-[#FDFCFC] text-sm font-medium text-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      disabled={isCartSyncing}
                      aria-label="Increase quantity"
                      className="flex h-7 w-7 items-center justify-center bg-[#F6F2EC] text-[#AA9778] disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-black/5 px-3 py-3">
              {isUpdatingSlot(item.id) ? (
                <p className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving slot…
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2 text-xs text-[#666]">
                      <Calendar className="h-4 w-4 shrink-0 text-[#D38516]" />
                      <span className="truncate">
                        {item.slotDate ? slotDateLabel(item.slotDate) : "No slot selected"}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSlotPickerItemId(item.id)}
                      disabled={isCartSyncing}
                      className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-[#CE9B5A] disabled:opacity-40"
                    >
                      {item.slotDate ? "Change" : "Select"}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  {item.slotStartTime && (
                    <div className="flex items-center gap-2 text-xs text-[#666]">
                      <Clock className="h-4 w-4 shrink-0 text-[#D38516]" />
                      {slotTimeRange(item.slotStartTime, item.duration)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        <div>
          <h3 className="mb-2 text-base font-medium text-black">Address</h3>
          <div className={CARD}>
            <div className="flex items-center justify-between gap-2 p-3">
              <span className="min-w-0 truncate text-sm font-medium text-black">
                {address ? addressLabel(address) : "No address selected"}
              </span>
              <button
                type="button"
                onClick={onToggleAddressForm}
                disabled={isCartSyncing}
                className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-[#CE9B5A] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {address ? "Change" : "Add address"}
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {address && (
              <p className="px-3 pb-3 text-xs leading-normal text-[#666]">{formatAddress(address)}</p>
            )}
            {isAddressFormOpen && (
              <AddressPicker
                addresses={addresses}
                selectedAddressId={address?.id}
                isSaving={isSavingAddress}
                onSelect={onSelectAddress}
                onCreate={onCreateAddress}
                onUpdate={onUpdateAddress}
              />
            )}
            {addressError && (
              <p className="border-t border-red-100 px-3 py-2 text-xs text-red-600">{addressError}</p>
            )}
          </div>
        </div>

        <label className={`flex items-center gap-2 ${CARD} px-3 py-3`}>
          <span className="text-xs font-medium text-gray-400">Coupon</span>
          <input
            value={couponCode}
            disabled={isCartSyncing}
            onChange={(event) => updateCartSchedule({ couponCode: event.target.value })}
            placeholder="Add code"
            className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-gray-400 disabled:opacity-40"
          />
        </label>
      </div>

      <div className="mt-2 space-y-3 pt-2">
        {paymentError && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {paymentError}
          </p>
        )}
        <div className="flex items-center justify-between gap-4 rounded-lg border border-black/8 bg-[radial-gradient(120%_120%_at_60%_0%,#FDE8CF_0%,rgba(255,226,173,0)_55%,#FDE8CF_100%)] p-4 shadow-[1px_1px_10px_rgba(0,0,0,0.12)]">
          <div className="text-center">
            <p className="text-sm text-black">
              Total ({cartCount} {cartCount === 1 ? "Item" : "Items"})
            </p>
            <p className="mt-1 text-xl font-semibold text-black">
              ₹{subtotal.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            disabled={isCheckingOut || isCartSyncing}
            className="shrink-0 rounded-lg bg-[#25180F] px-8 py-3.5 text-sm font-medium text-white hover:bg-[#3a2518] disabled:opacity-60"
          >
            {isCheckingOut
              ? "Opening payment…"
              : isCartSyncing
                ? "Updating…"
                : address
                  ? "Continue"
                  : "Add an address"}
          </button>
        </div>
      </div>

      {slotPickerItem && (
        <SlotPickerModal
          item={slotPickerItem}
          zoneId={slotPickerZoneId}
          onClose={() => setSlotPickerItemId(null)}
          onConfirm={(slotDate, slotStartTime) =>
            updateItemSlot(slotPickerItem.id, slotDate, slotStartTime)
          }
        />
      )}
    </div>
  );
}
