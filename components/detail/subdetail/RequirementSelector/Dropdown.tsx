"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
    <div className="border border-slate-150 rounded-2xl bg-white p-3 mb-2 shadow-xs transition-all hover:border-slate-300">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left cursor-pointer py-1"
      >
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {selectedItem?.title}
            {selectedItem?.subtitle ? ` • ${selectedItem.subtitle}` : ""}
          </p>
        </div>
        <span className="text-slate-400 shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap border-t border-slate-50 pt-4">
          {items.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`min-w-[145px] flex-1 rounded-2xl border p-3.5 text-left transition cursor-pointer sm:min-w-[165px] ${
                  isSelected
                    ? "border-amber-500 bg-amber-50/20 shadow-xs"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">{item.title}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                {item.subtitle ? (
                  <p className="mt-1 text-xs text-slate-500 leading-normal">{item.subtitle}</p>
                ) : null}
                {item.price ? (
                  <p className="mt-3 text-sm font-extrabold text-slate-900">{item.price}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
