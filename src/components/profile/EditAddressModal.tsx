"use client";

import { useMemo, useState } from "react";
import { Info, X } from "lucide-react";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import type { MeAddress } from "@/src/types/auth";

export type AddressFormValues = {
  label: string;
  customLabel: string;
  customerName: string;
  customerCountryCode: string;
  customerPhone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  isDefault: boolean;
};

const LABELS = ["HOME", "WORK", "OTHER"];
const COUNTRY_CODES = ["+91"];

const seed = (address: MeAddress | null): AddressFormValues => ({
  label: address?.label ?? "HOME",
  customLabel: address?.customLabel ?? "",
  customerName: address?.customerName ?? "",
  customerCountryCode: address?.customerCountryCode ?? "+91",
  customerPhone: "",
  line1: address?.line1 ?? "",
  line2: address?.line2 ?? "",
  landmark: address?.landmark ?? "",
  city: address?.city ?? "",
  state: address?.state ?? "",
  pincode: address?.pincode ?? "",
  latitude: address?.latitude != null ? String(address.latitude) : "",
  longitude: address?.longitude != null ? String(address.longitude) : "",
  isDefault: address?.isDefault ?? false,
});

const inputCls =
  "mt-1 h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-espresso outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 disabled:opacity-60";
const labelCls = "text-xs font-medium text-[#666]";

export default function EditAddressModal({
  address,
  isSaving,
  onClose,
  onSubmit,
}: {
  /** null / undefined → "Add Address" mode. */
  address?: MeAddress | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: AddressFormValues) => void;
}) {
  const isEdit = Boolean(address);
  const [values, setValues] = useState<AddressFormValues>(() => seed(address ?? null));
  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof AddressFormValues, string>> = {};
    if (!values.line1.trim()) e.line1 = "Required";
    if (!values.city.trim()) e.city = "Required";
    if (!values.state.trim()) e.state = "Required";
    if (!/^\d{6}$/.test(values.pincode.trim())) e.pincode = "6-digit PIN";
    if (values.customerPhone && !/^\d{10}$/.test(values.customerPhone.trim()))
      e.customerPhone = "10 digits";
    return e;
  }, [values]);

  const set = <K extends keyof AddressFormValues>(key: K, val: AddressFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length > 0 || isSaving) return;
    onSubmit(values);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 flex h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-white p-0 sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh] sm:w-[calc(100%-2rem)] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border sm:border-black/10 sm:shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 px-5 py-4">
          <h2 className="text-base font-semibold text-espresso">
            {isEdit ? "Edit Address" : "Add Address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#666] hover:bg-stone-100 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Label</span>
                <select
                  value={values.label}
                  onChange={(e) => set("label", e.target.value)}
                  className={inputCls}
                >
                  {LABELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelCls}>
                  Custom Label <span className="text-[#999]">(Optional)</span>
                </span>
                <input
                  value={values.customLabel}
                  onChange={(e) => set("customLabel", e.target.value)}
                  className={inputCls}
                  placeholder="My office"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Customer Name</span>
                <input
                  value={values.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                  className={inputCls}
                  placeholder="Full name"
                />
              </label>
              <label className="block">
                <span className={labelCls}>Customer Phone</span>
                <div className="mt-1 flex gap-2">
                  <select
                    value={values.customerCountryCode}
                    onChange={(e) => set("customerCountryCode", e.target.value)}
                    className="h-10 shrink-0 rounded-lg border border-black/10 bg-white px-2 text-sm text-espresso outline-none focus:border-amber-400"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    inputMode="numeric"
                    value={values.customerPhone}
                    onChange={(e) =>
                      set("customerPhone", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className={inputCls.replace("mt-1 ", "")}
                    placeholder="9090909090"
                  />
                </div>
                {touched && errors.customerPhone && (
                  <span className="mt-1 block text-[11px] text-red-500">{errors.customerPhone}</span>
                )}
                {isEdit && (
                  <span className="mt-1 block text-[11px] text-[#999]">
                    Leave blank to keep the saved number.
                  </span>
                )}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Address Line 1</span>
                <input
                  value={values.line1}
                  onChange={(e) => set("line1", e.target.value)}
                  className={inputCls}
                  placeholder="123 Main Street"
                />
                {touched && errors.line1 && (
                  <span className="mt-1 block text-[11px] text-red-500">{errors.line1}</span>
                )}
              </label>
              <label className="block">
                <span className={labelCls}>
                  Address Line 2 <span className="text-[#999]">(Optional)</span>
                </span>
                <input
                  value={values.line2}
                  onChange={(e) => set("line2", e.target.value)}
                  className={inputCls}
                  placeholder="Apt 4B"
                />
              </label>
            </div>

            <label className="block">
              <span className={labelCls}>
                Landmark <span className="text-[#999]">(Optional)</span>
              </span>
              <input
                value={values.landmark}
                onChange={(e) => set("landmark", e.target.value)}
                className={inputCls}
                placeholder="Near Central Park"
              />
            </label>

            <div className="grid grid-cols-3 gap-3">
              <label className="block">
                <span className={labelCls}>City</span>
                <input
                  value={values.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={inputCls}
                />
                {touched && errors.city && (
                  <span className="mt-1 block text-[11px] text-red-500">{errors.city}</span>
                )}
              </label>
              <label className="block">
                <span className={labelCls}>State</span>
                <input
                  value={values.state}
                  onChange={(e) => set("state", e.target.value)}
                  className={inputCls}
                />
                {touched && errors.state && (
                  <span className="mt-1 block text-[11px] text-red-500">{errors.state}</span>
                )}
              </label>
              <label className="block">
                <span className={labelCls}>Pincode</span>
                <input
                  inputMode="numeric"
                  value={values.pincode}
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={inputCls}
                />
                {touched && errors.pincode && (
                  <span className="mt-1 block text-[11px] text-red-500">{errors.pincode}</span>
                )}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls}>Latitude</span>
                <input
                  value={values.latitude}
                  onChange={(e) => set("latitude", e.target.value)}
                  className={inputCls}
                  placeholder="28.7041"
                />
              </label>
              <label className="block">
                <span className={labelCls}>Longitude</span>
                <input
                  value={values.longitude}
                  onChange={(e) => set("longitude", e.target.value)}
                  className={inputCls}
                  placeholder="77.1025"
                />
              </label>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                checked={values.isDefault}
                onChange={(e) => set("isDefault", e.target.checked)}
                className="h-4 w-4 shrink-0 accent-amber-600"
              />
              <span className="text-sm font-medium text-espresso">Set as default address</span>
            </label>

            {values.isDefault && (
              <div className="flex items-start gap-2 rounded-lg bg-[#FBF1E0] px-3 py-2.5 text-xs text-[#8a5a20]">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                This address will be used as your default for all bookings and deliveries.
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-black/5 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium text-[#666] hover:bg-stone-50 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save Address"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
