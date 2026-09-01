import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import { Category } from "@/src/utils/types/spabooking";

interface CategoriesMenuModalProps {
  isOpen: boolean;
  /** e.g. "Spa" — the top-level category these are subcategories/treatment
   *  types of. Only surfaced on the desktop popup (see below) — the
   *  mobile grid doesn't use it, kept exactly as it was. */
  categoryName: string;
  categories: Category[];
  media: string;
  activeTab: string;
  onClose: () => void;
  onCategoryClick: (id: string) => void;
}

export default function CategoriesMenuModal({
  isOpen,
  categoryName,
  categories,
  media,
  activeTab,
  onClose,
  onCategoryClick,
}: CategoriesMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Mobile/tablet — unchanged icon grid. */}
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-4 xs:p-6 pb-8 xs:pb-12 animate-in slide-in-from-bottom-8 duration-300 lg:hidden">
        <div className="flex justify-between items-center mb-4 xs:mb-6">
          <h3 className="text-lg xs:text-xl font-bold text-[#000000]">Menu</h3>

          <button
            onClick={onClose}
            className="p-2 bg-[#F5F5F5] rounded-full text-[#666666] hover:bg-[#E8E8E8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsive grid: 2 cols at 320px, 3 cols at sm+ */}
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 xs:gap-3 max-h-[60vh] overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onCategoryClick(cat.id);
                onClose();
              }}
              className="group flex cursor-pointer flex-col items-center gap-1.5 xs:gap-3 text-center transition-transform active:scale-95"
            >
              <div className="relative h-20 xs:h-24 sm:h-25 w-20 xs:w-24 sm:w-25 overflow-hidden rounded-xl xs:rounded-2xl bg-slate-100 shadow-sm shrink-0">
                <Image
                  src={cat.iconKey ?? media}
                  alt={cat.name}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </div>

              <span
                className={`text-xs xs:text-sm font-medium leading-tight transition-colors max-w-full ${
                  activeTab === cat.id
                    ? "bg-amber-50 text-amber-600"
                    : "text-slate-700"
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop — a list-style popup instead of the icon grid: a category
          label + a sensible heading (not "Select Category" — "category"
          already means Spa/Massage/Physiotherapy elsewhere in this app,
          and this list is actually the subcategories/treatment types
          within one of those) + full-width rows with a thumbnail, title
          and chevron. */}
      <div className="hidden lg:flex relative w-full max-w-lg max-h-[85vh] flex-col bg-white rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-all hover:bg-stone-50 active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="shrink-0 pr-12">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-600">
            {categoryName}
          </span>
          <h3 className="mt-1 text-2xl font-bold text-black">Explore Treatments</h3>
          <p className="mt-1 text-sm text-[#666]">Jump straight to a treatment type below.</p>
        </div>

        <div className="mt-5 flex-1 space-y-2.5 overflow-y-auto">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryClick(cat.id);
                  onClose();
                }}
                className={`group flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border p-2.5 text-left transition-all active:scale-[0.98] ${
                  isActive
                    ? "border-amber-300 bg-amber-50/60"
                    : "border-black/6 bg-white hover:border-amber-200 hover:bg-amber-50/30"
                }`}
              >
                <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={cat.iconKey ?? media}
                    alt={cat.name}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>

                <span
                  className={`flex-1 text-base font-semibold leading-tight ${
                    isActive ? "text-amber-700" : "text-slate-900"
                  }`}
                >
                  {cat.name}
                </span>

                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? "text-amber-600" : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
