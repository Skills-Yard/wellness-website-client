import Image from "next/image";
import { Star } from "lucide-react";
import { DynamicService } from "@/src/utils/types/spabooking";

interface SpotlightServiceCardProps {
  service: DynamicService;
  layout: "mobile" | "desktop";
  onDetailClick: (service: DynamicService) => void;
  onAddToCart: (service: DynamicService) => void;
}

export default function SpotlightServiceCard({
  service,
  layout,
  onDetailClick,
  onAddToCart,
}: SpotlightServiceCardProps) {
  const hasDiscount = !!(
    service.originalPrice && service.originalPrice !== service.price
  );
  const features = service.features ?? [];

  if (layout === "mobile") {
    return (
      <div className="flex flex-col w-full gap-2 xs:gap-3">
        <div className="relative w-full aspect-16/7 overflow-hidden rounded-lg bg-slate-100 shadow-xs">
          <Image
            src={service.media}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          {service.tag && (
            <span className="mb-1 text-[9px] xs:text-[10px] font-bold uppercase tracking-wider text-[#208900]">
              {service.tag}
            </span>
          )}

          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start w-full gap-2 xs:gap-3">
            <div className="flex flex-col max-w-full xs:max-w-[calc(100%-85px)]">
              <h3 className="text-sm xs:text-base font-medium text-[#000000] leading-tight line-clamp-2">
                {service.title}
              </h3>

              <p className="mt-1 text-xs xs:text-sm text-[#666666] flex items-center gap-0.5 xs:gap-1">
                <Star className="w-3 xs:w-3.5 h-3 xs:h-3.5 shrink-0 fill-[#FFB818] text-[#FFB818]" />
                <span className="font-medium">{service.rating}</span>
                <span className="truncate">({service.reviews})</span>
              </p>

              <p className="mt-1 text-xs xs:text-sm text-[#000000] font-medium flex items-center gap-1 flex-wrap">
                <span>{service.price}</span>
                {hasDiscount && (
                  <span className="text-[10px] xs:text-xs text-[#666666] line-through font-normal">
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
              className="w-16 xs:w-[76px] h-8 xs:h-[35px] bg-[#25180F] text-white rounded-lg font-medium text-xs xs:text-sm shrink-0 active:scale-95 transition-transform"
            >
              Book
            </button>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            {features.length > 0 && (
              <ul className="text-xs xs:text-sm text-[#666666] font-medium leading-snug space-y-0.5">
                {features.slice(0, 3).map((feat, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#666666] shrink-0 mt-1.5" />
                    <span className="line-clamp-1">{feat}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetailClick(service);
              }}
              className="w-fit text-xs xs:text-sm font-medium text-[#D38516] mt-1"
            >
              More details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col group/item">
      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-xs">
        <Image
          src={service.media}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {service.tag && (
            <span className="mb-1.5 inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#208900] bg-[#EAFDE1] px-2 py-0.5 rounded-md">
              {service.tag}
            </span>
          )}
          <h3 className="text-xl font-bold text-[#000000] group-hover/item:text-[#D38516] transition-colors">
            {service.title}
          </h3>
          <p className="mt-1 text-sm text-[#666666] flex items-center gap-1.5">
            <span className="flex gap-1 text-[#FFB818] font-bold">
              <Star className="w-4 h-4 fill-[#FFB818]" />
              {service.rating}
            </span>
            • <span>{service.reviews}</span>
          </p>
          <p className="mt-2 text-sm text-[#000000] font-medium">
            <span className="font-extrabold text-[#D38516] text-base">
              {service.price}
            </span>
            {hasDiscount && (
              <span className="text-[#666666] line-through text-xs ml-1 font-normal">
                {service.originalPrice}
              </span>
            )}{" "}
            • {service.duration}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(service);
          }}
          className="rounded-xl border border-[#E8CCBE] bg-[#FEF6F3] px-8 py-2.5 font-bold text-xs text-[#D38516] shadow-xs transition-all hover:bg-[#FDE9DD] cursor-pointer active:scale-95 shrink-0"
        >
          ADD
        </button>
      </div>
      {features.length > 0 && (
        <ul className="mt-2 space-y-1.5 text-xs text-slate-500">
          {features.slice(0, 3).map((feat, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-amber-500 font-bold">•</span>
              <span className="line-clamp-1">{feat}</span>
            </li>
          ))}
        </ul>
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
  );
}