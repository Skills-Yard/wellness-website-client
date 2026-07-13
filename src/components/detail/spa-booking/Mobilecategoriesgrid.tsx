import Image from "next/image";
import { Star } from "lucide-react";
import { Category } from "@/src/utils/types/spabooking";

interface MobileCategoriesGridProps {
  title: string;
  rating: string | number;
  reviews: string | number;
  media: string;
  categories: Category[];
  activeTab: string;
  onCategoryClick: (id: string) => void;
}

export default function MobileCategoriesGrid({
  title,
  rating,
  reviews,
  media,
  categories,
  activeTab,
  onCategoryClick,
}: MobileCategoriesGridProps) {
  return (
    <>
      <div className="w-full block lg:hidden bg-white pt-6 xs:pt-8 px-3 xs:px-4 sm:px-6">
        <div className="w-full mx-auto">
          <h2 className="text-base xs:text-lg sm:text-xl font-bold text-[#000000] mb-2 xs:mb-3 leading-tight">
            {title}
          </h2>
          <div className="flex items-center gap-1 text-xs xs:text-sm text-[#666666] leading-tight">
            <Star className="w-3 h-3 shrink-0 fill-[#FFB818] text-[#FFB818]" />
            <span className="font-bold text-[#000000]">{rating}</span>
            <span className="truncate">({reviews} bookings)</span>
          </div>
          <p className="text-xs xs:text-sm text-[#666666] mt-1.5">
            Find balance, relax your mind & body.
          </p>

          {/* Responsive grid: 3 cols */}
          <div className="grid mt-6 xs:mt-8 grid-cols-3 xs:grid-cols-3 gap-3 xs:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className="group flex cursor-pointer flex-col items-center gap-1.5 xs:gap-2.5 text-center"
              >
                <div className="relative h-20 xs:h-24 w-20 xs:w-24 overflow-hidden rounded-xl xs:rounded-[25px] bg-[#FEF3F1] border border-[#FDF6F4] shadow-xs transition-transform group-active:scale-95 flex items-center justify-center shrink-0">
                  <div className="relative w-full h-full">
                    <Image
                      src={media}
                      alt={cat.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <span
                  className={`text-xs xs:text-sm font-medium leading-tight text-center wrap-break-word max-w-full transition-colors ${activeTab === cat.id
                    ? "text-[#D38516] font-bold"
                    : "text-[#000000]"
                    }`}
                >
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="block lg:hidden my-6 xs:my-8 border-b-[3px] border-[#F3EFEB] w-full" />
    </>
  );
}