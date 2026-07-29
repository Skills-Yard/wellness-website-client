"use client";

import Image from "next/image";
import {
  ChevronRight,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/CartContext";
import type { Address, CreateAddressBody } from "@/src/services/addressApi";

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
  onContinue: () => void;
};
const formatAddress = (a: Address) =>
  [a.line1, a.line2, a.landmark, a.city, a.state, a.pincode]
    .filter(Boolean)
    .join(", ");

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
  onContinue,
}: Props) {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    scheduledDate,
    scheduledTime,
    isOnDemand,
    couponCode,
    updateCartSchedule,
  } = useCart();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const timeSlots = ["10:30", "12:00", "14:00", "16:00", "18:00"].filter(
    (time) => scheduledDate !== today || time > currentTime,
  );
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between border-b border-[#F3EFEB] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
            <ShoppingCart className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-gray-900">My Cart</h2>
            <p className="text-xs text-gray-400">
              {cartCount} {cartCount === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 rounded-xl border border-red-100 px-2.5 py-1.5 text-[11px] font-semibold text-red-400 hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3" />
          Clear all
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pb-2 pr-1">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl border border-[#F0EDEA] bg-[#FAFAFA] p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1">
                <h4 className="max-w-[150px] truncate text-[13px] font-bold text-gray-900">
                  {item.title}
                </h4>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-gray-300 hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                <Clock className="h-3 w-3" />
                {item.duration} • At home
              </p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[13px] font-extrabold text-[#D38516]">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
                <div className="flex items-center gap-2 rounded-md bg-gray-100 px-1 py-0.5">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                    className="flex h-5 w-5 items-center justify-center rounded bg-white disabled:opacity-40"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-4 text-center text-[11px] font-bold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="flex h-5 w-5 items-center justify-center rounded bg-white"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-[#F0EDEA]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                <MapPin className="h-4 w-4 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Service address
                </p>
                <p className="truncate text-[12px] font-semibold text-gray-800">
                  {address ? formatAddress(address) : "No address selected"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleAddressForm}
              className="flex shrink-0 items-center text-[12px] font-semibold text-amber-600"
            >
              {address ? "Change" : "Add address"}
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          {isAddressFormOpen && (
            <AddressPicker
              addresses={addresses}
              selectedAddressId={address?.id}
              isSaving={isSavingAddress}
              onSelect={onSelectAddress}
              onCreate={onCreateAddress}
            />
          )}
          {addressError && (
            <p className="border-t border-red-100 px-4 py-2 text-xs text-red-600">
              {addressError}
            </p>
          )}
        </div>
        <div className="space-y-3 rounded-2xl border border-[#F0EDEA] p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-800">
                On-demand service
              </p>
              <p className="text-[11px] text-gray-500">
                Book as soon as possible
              </p>
            </div>
            <input
              type="checkbox"
              checked={isOnDemand}
              onChange={(event) =>
                updateCartSchedule({ isOnDemand: event.target.checked })
              }
              className="h-4 w-4 accent-amber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] font-medium text-gray-500">
              Date
              <input
                type="date"
                min={today}
                disabled={isOnDemand}
                value={scheduledDate}
                onChange={(event) =>
                  updateCartSchedule({
                    scheduledDate: event.target.value,
                    scheduledTime: "",
                  })
                }
                className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs disabled:bg-gray-50"
              />
            </label>
            <label className="text-[11px] font-medium text-gray-500">
              Time
              <select
                disabled={isOnDemand || !scheduledDate || timeSlots.length === 0}
                value={scheduledTime}
                onChange={(event) =>
                  updateCartSchedule({ scheduledTime: event.target.value })
                }
                className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs disabled:bg-gray-50"
              >
                <option value="">
                  {timeSlots.length ? "Choose time" : "No slots left"}
                </option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-[11px] font-medium text-gray-500">
            Coupon code
            <input
              value={couponCode}
              onChange={(event) =>
                updateCartSchedule({ couponCode: event.target.value })
              }
              placeholder="WELCOME20"
              className="mt-1 h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs"
            />
          </label>
        </div>
      </div>
      <div className="mt-2 space-y-3 border-t border-[#F3EFEB] pt-4">
        {paymentError && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {paymentError}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-gray-500">
            Total ({cartCount} {cartCount === 1 ? "Item" : "Items"})
          </span>
          <span className="text-[20px] font-extrabold text-gray-900">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <Button
          onClick={onContinue}
          disabled={isCheckingOut}
          className="h-12 w-full rounded-2xl border-none bg-[#25180F] text-[15px] font-bold text-white hover:bg-[#3a2518] disabled:opacity-60"
        >
          {isCheckingOut
            ? "Opening payment…"
            : address
              ? "Checkout"
              : "Add an address to checkout"}
        </Button>
      </div>
    </div>
  );
}

function AddressPicker({
  addresses,
  selectedAddressId,
  isSaving,
  onSelect,
  onCreate,
}: {
  addresses: Address[];
  selectedAddressId?: string;
  isSaving: boolean;
  onSelect: (address: Address) => void;
  onCreate: (address: AddressInput) => void;
}) {
  const testLatitude = 28.6311026;
  const testLongitude = 77.2183546;
  const field =
    "h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-amber-400";
  const submit = (formData: FormData) =>
    onCreate({
      label: String(formData.get("label") ?? "HOME"),
      customLabel: String(formData.get("customLabel") ?? "").trim(),
      line1: String(formData.get("line1") ?? "").trim(),
      line2: String(formData.get("line2") ?? "").trim(),
      landmark: String(formData.get("landmark") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      pincode: String(formData.get("pincode") ?? "").trim(),
      latitude: testLatitude,
      longitude: testLongitude,
      isDefault: formData.get("isDefault") === "on",
    });
  return (
    <div className="space-y-2 border-t border-[#F0EDEA] p-3">
      {addresses.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className={`w-full rounded-xl border p-3 text-left text-xs ${selectedAddressId === item.id ? "border-amber-400 bg-amber-50" : "border-gray-100 hover:bg-gray-50"}`}
        >
          <span className="font-bold text-gray-800">
            {item.customLabel || item.label || "Address"}
          </span>
          <span className="mt-0.5 block text-gray-500">
            {formatAddress(item)}
          </span>
        </button>
      ))}
      <form action={submit} className="space-y-2 rounded-xl bg-gray-50 p-3">
        <p className="text-xs font-bold text-gray-700">Add a new address</p>
        <div className="grid grid-cols-2 gap-2">
          <select name="label" defaultValue="HOME" className={field}>
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            name="customLabel"
            placeholder="Custom label"
            className={field}
          />
        </div>
        <input
          name="line1"
          required
          placeholder="Address line 1"
          className={field}
        />
        <input name="line2" placeholder="Address line 2" className={field} />
        <input name="landmark" placeholder="Landmark" className={field} />
        <div className="grid grid-cols-2 gap-2">
          <input name="city" required placeholder="City" className={field} />
          <input name="state" required placeholder="State" className={field} />
        </div>
        <input
          name="pincode"
          required
          placeholder="Pincode"
          className={field}
        />
        <p className="text-[11px] text-gray-500">
          Test coordinates: {testLatitude}, {testLongitude}
        </p>
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input name="isDefault" type="checkbox" /> Set as default address
        </label>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-[#25180F] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save address"}
        </button>
      </form>
    </div>
  );
}
