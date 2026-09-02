"use client";

import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Home,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { MeAddress } from "@/src/types/auth";
import EditAddressModal, { type AddressFormValues } from "./EditAddressModal";

const MAX_ADDRESSES = 5;

function LabelIcon({ label, className }: { label?: string | null; className?: string }) {
  return (label ?? "").toUpperCase() === "WORK" ? (
    <Briefcase className={className} />
  ) : (
    <Home className={className} />
  );
}

const lines = (a: MeAddress) =>
  [a.line1, a.line2, a.landmark].filter(Boolean).join(", ");
const locality = (a: MeAddress) =>
  [a.city, a.state, a.pincode ? `- ${a.pincode}` : null].filter(Boolean).join(", ");

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: MeAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-black/5 p-3 sm:p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FBF7ED] text-brown">
        <LabelIcon label={address.label} className="h-4.5 w-4.5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#666]">
            {(address.label ?? "OTHER").toUpperCase()}
          </span>
          {address.isDefault && (
            <span className="rounded-full bg-[#FBF1E0] px-1.5 py-0.5 text-[10px] font-semibold text-[#8a5a20]">
              Default
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-espresso">
          {address.customLabel && (
            <span className="font-semibold">{address.customLabel}, </span>
          )}
          {lines(address) || "—"}
        </p>
        <p className="text-sm text-espresso">{locality(address)}</p>
        {address.latitude != null && address.longitude != null && (
          <p className="mt-1 text-xs text-[#999]">
            {address.latitude}, {address.longitude}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit address"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#666] hover:bg-stone-100"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More actions"
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#666] hover:bg-stone-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl border-black/10 bg-white p-1">
            {!address.isDefault && (
              <DropdownMenuItem
                onClick={onSetDefault}
                className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm text-espresso focus:bg-stone-50"
              >
                <Star className="h-4 w-4 text-amber-600" />
                Set as default
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={onDelete}
              className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function AddressBook({
  addresses,
  isSaving,
  limit,
  onCreate,
  onUpdate,
  onDelete,
  onSetDefault,
  onViewAll,
}: {
  addresses: MeAddress[];
  isSaving: boolean;
  /** When set, only this many cards show, with a "View all" row. */
  limit?: number;
  onCreate: (values: AddressFormValues) => void;
  onUpdate: (id: string, values: AddressFormValues) => void;
  onDelete: (id: string) => void;
  onSetDefault: (address: MeAddress) => void;
  onViewAll?: () => void;
}) {
  // `undefined` = closed, `null` = add mode, MeAddress = edit that one.
  const [editing, setEditing] = useState<MeAddress | null | undefined>(undefined);

  const atLimit = addresses.length >= MAX_ADDRESSES;
  const visible = limit ? addresses.slice(0, limit) : addresses;
  const hiddenCount = addresses.length - visible.length;

  const handleSubmit = (values: AddressFormValues) => {
    if (editing) onUpdate(editing.id, values);
    else onCreate(values);
    setEditing(undefined);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4.5 w-4.5 text-brown" />
          <h2 className="text-base font-semibold text-espresso">Addresses</h2>
          <span className="text-xs text-[#999]">
            {addresses.length}/{MAX_ADDRESSES}
          </span>
        </div>
        <button
          type="button"
          onClick={() => !atLimit && setEditing(null)}
          disabled={atLimit}
          title={atLimit ? `You can save up to ${MAX_ADDRESSES} addresses` : undefined}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-600/40 px-3 py-1.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-[#FBF1E0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/10 px-4 py-8 text-center text-sm text-[#999]">
          No addresses saved yet.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setEditing(address)}
              onDelete={() => onDelete(address.id)}
              onSetDefault={() => onSetDefault(address)}
            />
          ))}
        </div>
      )}

      {limit && hiddenCount > 0 && onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FBF7ED] py-3 text-sm font-semibold text-amber-600 hover:bg-[#F7EBD3]"
        >
          View all addresses
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {atLimit && !limit && (
        <p className="mt-3 text-center text-xs text-[#999]">
          You&apos;ve reached the maximum of {MAX_ADDRESSES} saved addresses.
        </p>
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
