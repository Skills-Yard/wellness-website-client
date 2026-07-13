import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Category } from "@/src/utils/types/spabooking";

interface MobileStickyNavbarProps {
  title: string;
  isScrolled: boolean;
  activeTab: string;
  activeCategories: Category[];
  onCategoryClick: (id: string) => void;
}

export default function MobileStickyNavbar({
  title,
  isScrolled,
  activeTab,
  activeCategories,
  onCategoryClick,
}: MobileStickyNavbarProps) {
  return (
    <div
      className={`fixed lg:hidden md:hidden top-0 inset-x-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Top Bar */}
      <div className="flex h-16 items-center justify-between px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 xs:gap-4">
          <Link
            href="/"
            className="p-2 -ml-1 xs:-ml-2 z-9999 w-8.25 h-8.25 text-center flex items-center justify-center bg-[#FFFFFF] rounded-[5px] hover:bg-slate-100 transition-colors border border-[#EDEDED]"
          >
            <ArrowLeft className="w-5 h-4 text-[#000000]" />
          </Link>

          <h1
            className={`text-sm xs:text-base font-bold text-[#000000] transition-all duration-300 truncate ${
              isScrolled
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-center flex items-center justify-center w-8.25 h-8.25 bg-[#ffffff] rounded-[5px] hover:bg-slate-100 transition-colors border border-[#EDEDED]">
            <Search className="w-4.75 h-4.75 text-[#4B5563]" />
          </button>
        </div>
      </div>

      {/* Mini Category Navbar */}
      <div
        className={`border-t border-[#F3EFEB] bg-white lg:hidden transition-all duration-300 ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex overflow-x-auto hide-scrollbar px-3 xs:px-4 py-2 gap-4 xs:gap-6 max-w-7xl mx-auto">
          {activeCategories.map(
            (cat) =>
              activeTab === cat.id && (
                <button
                  key={cat.id}
                  onClick={() => onCategoryClick(cat.id)}
                  className="whitespace-nowrap text-xs xs:text-sm font-bold text-[#D38516] transition-colors"
                >
                  {cat.name}
                </button>
              ),
          )}
        </div>
      </div>
    </div>
  );
}