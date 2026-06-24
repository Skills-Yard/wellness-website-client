"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type DropdownItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  price?: string;
  badge?: string;
  icon?: React.ReactNode;
};

type DropdownProps = {
  label: string;
  items: DropdownItem[];
  visibleCount?: number;
  onSelect?: (item: DropdownItem) => void;
};

export default function Dropdown({ label, items, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  const handleSelect = (item: DropdownItem) => {
    setSelectedId(item.id);
    setOpen(false);
    onSelect?.(item);
  };

  return (
    <div className="space-y-3">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-300 hover:border-amber-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 active:scale-98"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {label}
            </p>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {selectedItem?.title}
              {selectedItem?.subtitle ? (
                <span className="text-slate-500 font-normal ml-1">
                  • {selectedItem.subtitle}
                </span>
              ) : null}
            </p>
          </div>
          
          {selectedItem?.price && (
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-slate-400">Price</p>
              <p className="text-sm font-bold text-amber-600">
                {selectedItem.price}
              </p>
            </div>
          )}
          
          <ChevronDown
            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-2 pt-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {items.map((item, index) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between gap-3 ${
                    index !== items.length - 1 ? "border-b border-slate-100" : ""
                  } ${
                    isSelected
                      ? "bg-amber-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700 uppercase tracking-wider flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.price && (
                      <span className="text-sm font-bold text-amber-600">
                        {item.price}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}