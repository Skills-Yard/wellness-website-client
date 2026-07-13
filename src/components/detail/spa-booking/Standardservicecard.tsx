import Image from "next/image";
import { Star } from "lucide-react";
import { DynamicService } from "@/src/utils/types/spabooking";

interface StandardServiceCardProps {
  service: DynamicService;
  layout: "mobile" | "desktop";
  onDetailClick: (service: DynamicService) => void;
  onAddToCart: (service: DynamicService) => void;
}

export default function StandardServiceCard({
  service,
  layout,
  onDetailClick,
  onAddToCart,
}: StandardServiceCardProps) {
  const hasDiscount = !!(
    service.originalPrice && service.originalPrice !== service.price
  );
  const features = service.features ?? [];

  if (layout === "mobile") {
    return (
      <div className="flex gap-3 xs:gap-4 w-full">
        <div className="group relative shrink-0 w-35 xs:w-[160px] sm:w-48.5 h-25 xs:h-[115px] sm:h-34.75 overflow-hidden rounded-lg bg-slate-100 shadow-xs cursor-pointer">
          <Image
            src={service.media}
            alt={service.title}
            fill
            className="object-cover"
          />

          {/* View More Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 xs:py-1.5 text-center text-[10px] xs:text-xs font-bold text-[#D38516] transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
            View Details
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-between py-0.5">
          <div className="flex flex-col">
            <h3 className="text-xs xs:text-sm font-medium text-[#000000] leading-snug line-clamp-2">
              {service.title}
            </h3>

            <p className="mt-0.5 xs:mt-1 text-xs text-[#666666] flex items-center gap-0.5">
              <Star className="w-3 h-3 shrink-0 fill-[#FFB818] text-[#FFB818]" />
              <span className="font-medium">{service.rating}</span>
              <span className="truncate text-[10px]">({service.reviews})</span>
            </p>

            <p className="mt-0.5 xs:mt-1 text-xs xs:text-sm text-[#000000] font-medium flex items-center gap-1 flex-wrap">
              <span>{service.price}</span>
              {hasDiscount && (
                <span className="text-[9px] xs:text-[10px] text-[#666666] line-through font-normal">
                  {service.originalPrice}
                </span>
              )}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(service);
            }}
            className="mt-2 w-14 xs:w-16 h-7 xs:h-8 bg-[#25180F] text-white rounded-lg font-medium text-xs shrink-0 active:scale-95 transition-transform"
          >
            Book
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col justify-between gap-6 group/item">
      <div className="flex gap-4">
        <div className="relative mt-2 h-36.25 w-30 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
            <Image
              src={service.media}
              alt={service.title}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(service);
            }}
            className="absolute -bottom-4 left-1/2 flex w-10/12 -translate-x-1/2 items-center justify-center rounded-xl border border-[#E8CCBE] bg-white py-2 text-xs font-bold text-[#D38516] shadow-md transition-all hover:bg-[#FEF6F3] cursor-pointer active:scale-95"
          >
            ADD
          </button>
        </div>
        <div className="flex-1">
          {service.tag && (
            <span className="mb-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
              {service.tag}
            </span>
          )}
          <h3 className="text-[15px] font-bold text-[#000000] group-hover/item:text-[#D38516] transition-colors">
            {service.title}
          </h3>
          <p className="mt-0 text-[11px] text-[#666666] flex items-center gap-1.5">
            <span className="flex gap-1 text-[#FFB818] font-bold">
              <Star className="w-3 h-3 fill-[#FFB818]" />
              {service.rating}
            </span>
            • <span>{service.reviews}</span>
          </p>
          <p className="mt-0 text-[13px] text-[#000000] font-medium">
            <span className="font-extrabold text-[#D38516] text-[13px]">
              {service.price}
            </span>
            {hasDiscount && (
              <span className="text-[#666666] line-through text-[10px] ml-1 font-normal">
                {service.originalPrice}
              </span>
            )}{" "}
            • {service.duration}
          </p>
          {features.length > 0 && (
            <p className="mt-2 text-[13px] text-[#666666] line-clamp-1">
              {features[0]}
            </p>
          )}
          <div className="mt-1 flex pt-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetailClick(service);
              }}
              className="sm:w-auto cursor-pointer px-0 py-1 text-[11px] font-bold text-[#D38516] transition-all hover:opacity-75 active:scale-95"
            >
              More details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}