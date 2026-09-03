"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { MeAddress } from "@/src/types/auth";
import EditAddressModal, { type AddressFormValues } from "../EditAddressModal";
import { MobileScreenHeader } from "./shared";

const lines = (a: MeAddress) => [a.line1, a.line2, a.landmark].filter(Boolean).join(", ");
const locality = (a: MeAddress) =>
  [a.city, a.state, a.pincode ? `- ${a.pincode}` : null].filter(Boolean).join(", ");

function Radio({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-amber-600" : "border-black/20"
      }`}
    >
      {selected && <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />}
    </span>
  );
}

/** Phone-only "My Addresses" — a select-a-default flow (radio + Confirm)
 *  layered on top of the same create/update/set-default plumbing the
 *  desktop AddressBook uses, since there's no separate saved-address API
 *  to select "for" — selecting one here just sets it as the account's
 *  default address, same as AddressBook's "Set as default" action. */
export default function MobileAddresses({
  addresses,
  isSaving,
  onBack,
  onCreate,
  onUpdate,
  onSetDefault,
}: {
  addresses: MeAddress[];
  isSaving: boolean;
  onBack: () => void;
  onCreate: (values: AddressFormValues) => void;
  onUpdate: (id: string, values: AddressFormValues) => void;
  onSetDefault: (address: MeAddress) => void;
}) {
  const defaultId = addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id;
  const [selectedId, setSelectedId] = useState(defaultId);
  // `undefined` = closed, `null` = add mode, MeAddress = edit that one.
  const [editing, setEditing] = useState<MeAddress | null | undefined>(undefined);

  const handleSubmit = (values: AddressFormValues) => {
    if (editing) onUpdate(editing.id, values);
    else onCreate(values);
    setEditing(undefined);
  };

  const handleConfirm = () => {
    const selected = addresses.find((a) => a.id === selectedId);
    if (selected && !selected.isDefault) onSetDefault(selected);
    onBack();
  };

  return (
    <div>
      <MobileScreenHeader title="My Addresses" onBack={onBack} />

      {addresses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-black/10 px-4 py-10 text-center text-xs text-[#999]">
          No addresses saved yet.
        </p>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => {
            const selected = address.id === selectedId;
            return (
              <div
                key={address.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(address.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedId(address.id);
                }}
                className={`flex w-full items-start justify-between gap-3 rounded-lg border p-3.5 text-left ${
                  selected ? "border-black/8" : "border-black/4"
                }`}
                style={
                  selected
                    ? {
                        background:
                          "radial-gradient(159% 352% at 62% -12%, #FDE8CF 0%, rgba(254,229,189,0.47) 0%, rgba(255,226,173,0) 51%, rgba(255,227,176,0.07) 75%, #FDE8CF 100%)",
                      }
                    : undefined
                }
              >
                <Radio selected={selected} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-espresso">
                    {address.customerName || "—"}
                  </p>
                  <p className="mt-1 text-xs text-[#666]">
                    {[lines(address), locality(address)].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(address);
                  }}
                  className="shrink-0 text-xs font-medium text-amber-600"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setEditing(null)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black/8 py-4 text-xs font-medium text-espresso"
      >
        <Plus className="h-4.5 w-4.5 text-amber-600" />
        Add Address
      </button>

      {addresses.length > 0 && (
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSaving}
          className="mt-6 w-full rounded-lg bg-espresso py-3.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          Confirm Address
        </button>
      )}

      {editing !== undefined && (
        <EditAddressModal
          address={editing}
          isSaving={isSaving}
          onClose={() => setEditing(undefined)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
