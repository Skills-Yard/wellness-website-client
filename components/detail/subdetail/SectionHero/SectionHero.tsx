"use client";

import ImageSlider from "./ImageSlider";

interface SectionHeroProps {
  service: any;
}

export default function SectionHero({ service }: SectionHeroProps) {
  if (!service) return null;

  const rating = service.rating || "4.8";
  const reviewsText = service.reviews || "1K reviews";
  const startingPrice = `${service.price}/session`;
  const sliderImages = [service.media];

  return (
    <section className="mx-auto rounded-3xl w-full px-0 py-0">
      <div className="bg-white border-b border-slate-100 pb-5">
        <ImageSlider images={sliderImages} count={1} />

        <div className="mt-4 px-6">
          <div className="flex flex-col gap-1.5">
            <div className="max-w-3xl space-y-1.5">
              {service.tag && (
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                  {service.tag}
                </span>
              )}
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight text-slate-900">
                {service.title}
              </h1>
            </div>

            <div className="mt-1 flex items-center justify-between border-t border-slate-50 pt-3">
              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                <span className="text-yellow-500 text-base">★</span>
                <span>{rating}</span>
                <span className="text-slate-400 font-normal">({reviewsText})</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-slate-400 font-normal">Starts at</span>
                <span className="text-base font-extrabold text-amber-600">{startingPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
