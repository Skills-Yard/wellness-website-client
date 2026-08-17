"use client";

import { useEffect, useState } from "react";
import { formatAddressLabel } from "@/src/services/addressApi";
import type { Address, CreateAddressBody } from "@/src/services/addressApi";

export type AddressInput = Omit<CreateAddressBody, "userId">;

/** Shared saved-address list + create/edit form. Originally lived only in
 *  CartView.tsx (checkout's address step); extracted here so the profile
 *  page's address management can reuse the exact same, already-working
 *  geolocation-on-create / edit-in-place behavior instead of rebuilding it.
 *  `onDelete` is optional — CartView doesn't pass it (checkout has no
 *  reason to delete an address mid-flow), only the profile page does.
 *  `onSelect` is likewise optional — omit it (as the profile page does) to
 *  render each saved address as plain text instead of a "pick this one"
 *  button, since picking doesn't mean anything outside checkout. */
export function AddressPicker({
  addresses,
  selectedAddressId,
  isSaving,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
  isDeleting,
}: {
  addresses: Address[];
  selectedAddressId?: string;
  isSaving: boolean;
  onSelect?: (address: Address) => void;
  onCreate: (address: AddressInput) => void;
  onUpdate: (addressId: string, address: AddressInput) => void;
  onDelete?: (addressId: string) => void;
  isDeleting?: boolean;
}) {
  // Which saved address the form is editing, or null for "add a new one".
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Picked up automatically from the browser instead of a fixed test point
  // — mirrors the same getCurrentPosition pattern used for zone lookup on
  // the home page (src/app/page.tsx) and category page (spa-booking/index.tsx).
  // Only used for brand-new addresses — editing an existing one keeps its
  // saved coordinates rather than silently overwriting them with wherever
  // the user happens to be standing while they fix a typo in the pincode.
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!navigator.geolocation) {
      // Deferred (not called straight from the effect body) — same pattern
      // spa-booking/index.tsx uses for this exact branch.
      queueMicrotask(() => {
        if (isMounted) {
          setLocationStatus("error");
          setLocationError(
            "Location isn't supported by this browser — you can still save the address, but its map position may be off.",
          );
        }
      });
      return () => {
        isMounted = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMounted) return;
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("ready");
      },
      (error) => {
        if (!isMounted) return;
        setLocationStatus("error");
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission denied — you can still save the address, but its map position may be off."
            : "Couldn't detect your location — you can still save the address, but its map position may be off.",
        );
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const field =
    "h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-amber-400";
  const submit = (formData: FormData) => {
    const values: AddressInput = {
      label: String(formData.get("label") ?? "HOME"),
      customLabel: String(formData.get("customLabel") ?? "").trim(),
      line1: String(formData.get("line1") ?? "").trim(),
      line2: String(formData.get("line2") ?? "").trim(),
      landmark: String(formData.get("landmark") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      pincode: String(formData.get("pincode") ?? "").trim(),
      // Editing keeps the address's existing coordinates. Creating falls
      // back to 0/0 only when geolocation genuinely failed/was denied — the
      // address itself (line1/city/etc.) is still worth saving even then,
      // so this doesn't block submission, just degrades the map position.
      latitude: editingAddress ? (editingAddress.latitude ?? 0) : (coords?.latitude ?? 0),
      longitude: editingAddress ? (editingAddress.longitude ?? 0) : (coords?.longitude ?? 0),
      isDefault: formData.get("isDefault") === "on",
    };

    if (editingAddress) {
      onUpdate(editingAddress.id, values);
      setEditingAddress(null);
    } else {
      onCreate(values);
    }
  };

  return (
    <div className="space-y-2 border-t border-[#F0EDEA] p-3">
      {addresses.map((item) => (
        <div
          key={item.id}
          className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${selectedAddressId === item.id ? "border-amber-400 bg-amber-50" : "border-gray-100 hover:bg-gray-50"}`}
        >
          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="min-w-0 flex-1 text-left"
            >
              <span className="font-bold text-gray-800">
                {item.customLabel || item.label || "Address"}
              </span>
              <span className="mt-0.5 block text-gray-500">
                {formatAddressLabel(item)}
              </span>
            </button>
          ) : (
            <div className="min-w-0 flex-1">
              <span className="font-bold text-gray-800">
                {item.customLabel || item.label || "Address"}
                {item.isDefault && (
                  <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                    Default
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-gray-500">
                {formatAddressLabel(item)}
              </span>
            </div>
          )}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setEditingAddress(item)}
              className="rounded-lg px-2 py-1 text-[11px] font-semibold text-amber-600 hover:bg-amber-100"
            >
              Edit
            </button>
            {onDelete && (
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => onDelete(item.id)}
                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
      {/* Keyed on which address (if any) is being edited so the uncontrolled
          defaultValue inputs below remount with fresh values instead of
          keeping whatever was typed for a previously-edited address. */}
      <form
        key={editingAddress?.id ?? "new"}
        action={submit}
        className="space-y-2 rounded-xl bg-gray-50 p-3"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-700">
            {editingAddress ? "Edit address" : "Add a new address"}
          </p>
          {editingAddress && (
            <button
              type="button"
              onClick={() => setEditingAddress(null)}
              className="text-[11px] font-semibold text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            name="label"
            defaultValue={editingAddress?.label ?? "HOME"}
            className={field}
          >
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            name="customLabel"
            defaultValue={editingAddress?.customLabel ?? ""}
            placeholder="Custom label"
            className={field}
          />
        </div>
        <input
          name="line1"
          required
          defaultValue={editingAddress?.line1 ?? ""}
          placeholder="Address line 1"
          className={field}
        />
        <input
          name="line2"
          defaultValue={editingAddress?.line2 ?? ""}
          placeholder="Address line 2"
          className={field}
        />
        <input
          name="landmark"
          defaultValue={editingAddress?.landmark ?? ""}
          placeholder="Landmark"
          className={field}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            name="city"
            required
            defaultValue={editingAddress?.city ?? ""}
            placeholder="City"
            className={field}
          />
          <input
            name="state"
            required
            defaultValue={editingAddress?.state ?? ""}
            placeholder="State"
            className={field}
          />
        </div>
        <input
          name="pincode"
          required
          defaultValue={editingAddress?.pincode ?? ""}
          placeholder="Pincode"
          className={field}
        />
        {/* Geolocation status is only meaningful for a brand-new address —
            editing keeps the existing coordinates (see submit above). */}
        {!editingAddress && locationStatus === "loading" && (
          <p className="text-[11px] text-gray-500">
            Detecting your location…
          </p>
        )}
        {!editingAddress && locationStatus === "ready" && coords && (
          <p className="text-[11px] text-green-600">
            Using your current location ({coords.latitude.toFixed(4)},{" "}
            {coords.longitude.toFixed(4)}) for this address.
          </p>
        )}
        {!editingAddress && locationStatus === "error" && locationError && (
          <p className="text-[11px] text-amber-600">{locationError}</p>
        )}
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input
            name="isDefault"
            type="checkbox"
            defaultChecked={editingAddress?.isDefault ?? false}
          />{" "}
          Set as default address
        </label>
        <button
          type="submit"
          disabled={isSaving || (!editingAddress && locationStatus === "loading")}
          className="rounded-lg bg-[#25180F] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
        >
          {isSaving
            ? "Saving…"
            : !editingAddress && locationStatus === "loading"
              ? "Detecting location…"
              : editingAddress
                ? "Save changes"
                : "Save address"}
        </button>
      </form>
    </div>
  );
}
