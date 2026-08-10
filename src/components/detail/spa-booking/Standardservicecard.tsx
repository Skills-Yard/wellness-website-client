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
      <div className="flex h-[139px] w-full gap-4">
        <div className="group relative h-[139px] w-[194px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <Image
            src={service.media}
            alt={service.title}
            fill
            className="object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick(service);
            }}
            className="absolute inset-x-0 bottom-0 h-7 bg-black/60 text-xs leading-[116%] font-medium text-white"
          >
            View details
          </button>
        </div>

        <div className="flex h-[136px] min-w-0 flex-1 flex-col gap-2 pt-px">
          <h3 className="line-clamp-1 text-sm leading-[116%] font-medium text-black">
              {service.title}
          </h3>

          <p className="flex h-3.5 items-center gap-1.5 text-xs leading-[116%] text-[#666666]">
            <span className="flex items-center gap-[5px]">
              <Star className="h-[11.25px] w-[11.25px] shrink-0 fill-[#FFB818] text-[#FFB818]" />
              <span>{service.rating}</span>
            </span>
            <span className="truncate">({service.reviews})</span>
          </p>

          <p className="flex h-4 items-center gap-1 text-sm leading-[116%] font-medium text-black">
            <span>Starting at {service.price}</span>
            {hasDiscount && (
              <span className="text-xs leading-[116%] text-[#666666] line-through">
                {service.originalPrice}
              </span>
            )}
          </p>

          <div className="flex flex-col items-start gap-[18px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(service);
              }}
              className="h-[35px] w-[76px] rounded bg-[#25180F] text-base leading-[19px] font-medium text-white active:scale-95 transition-transform"
            >
              Book
            </button>
          </div>
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
