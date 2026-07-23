import Image from "next/image";
import { X } from "lucide-react";
import { Category } from "@/src/utils/types/spabooking";

interface CategoriesMenuModalProps {
  isOpen: boolean;
  categories: Category[];
  media: string;
  activeTab: string;
  onClose: () => void;
  onCategoryClick: (id: string) => void;
}

export default function CategoriesMenuModal({
  isOpen,
  categories,
  media,
  activeTab,
  onClose,
  onCategoryClick,
}: CategoriesMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 xs:p-6 pb-8 xs:pb-12 animate-in slide-in-from-bottom-8 duration-300">
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
                  src={media}
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
    </div>
  );
}