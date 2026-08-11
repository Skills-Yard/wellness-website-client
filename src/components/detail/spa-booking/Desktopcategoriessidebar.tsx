import { Category } from "@/src/utils/types/spabooking";
import Image from "next/image";

interface DesktopCategoriesSidebarProps {
  categories: Category[];
  media: string;
  activeTab: string;
  onCategoryClick: (id: string) => void;
}

export default function DesktopCategoriesSidebar({
  categories,
  media,
  activeTab,
  onCategoryClick,
}: DesktopCategoriesSidebarProps) {
  return (
    <div className="hidden lg:block w-full shrink-0 lg:sticky lg:top-24 lg:w-70">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Select Service
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className="group flex cursor-pointer flex-col items-center gap-2 text-center transition-transform hover:scale-105"
            >
              <div
                className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-colors ${
                  activeTab === cat.id
                    ? "border-amber-500"
                    : "border-slate-200"
                }`}
              >
                <Image
                  src={cat.iconKey ?? media}
                  alt={cat.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <span
                className={`text-[11px] font-medium leading-tight wrap-break-word max-w-17.5 transition-colors ${
                  activeTab === cat.id
                    ? "text-amber-600"
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