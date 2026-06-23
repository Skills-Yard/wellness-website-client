"use client";

import { useState } from "react";

type DropdownItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  price?: string;
  badge?: string;
};

type DropdownProps = {
  label: string;
  items: DropdownItem[];
  visibleCount: number;
};

export default function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <div className=" border-b border-slate-200 bg-white p-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full p-2 items-center justify-between gap-1 py-2 text-left transition hover:bg-slate-100"
      >
        <div>
          <p className="text-sm font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm text-slate-600">
            {selectedItem?.title}
            {selectedItem?.subtitle ? ` • ${selectedItem.subtitle}` : ""}
          </p>
        </div>
        <span className="text-xl text-slate-500">{open ? "˅" : "˃"}</span>
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-3 overflow-x-auto pb-1 sm:flex-row sm:flex-wrap">
          {items.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`min-w-[145px] flex-1 rounded-3xl border p-3 text-left transition sm:min-w-[165px] ${
                  isSelected
                    ? "border-slate-900 bg-slate-100"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-950">{item.title}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                {item.subtitle ? (
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.subtitle}</p>
                ) : null}
                {item.price ? (
                  <p className="mt-3 text-sm font-semibold text-slate-950">{item.price}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
