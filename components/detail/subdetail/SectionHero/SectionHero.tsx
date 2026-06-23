"use client";

import ImageSlider from "./ImageSlider";

const sliderImages = [
  "/images/hero-1.svg",
  "/images/hero-2.svg",
  "/images/hero-3.svg",
];

export default function SectionHero() {
  const rating = 4.9;
  const reviewCount = 1_023;
  const startingPrice = "₹ 1,319/session";

  return (
    <section className="mx-auto rounded-3xl w-full px-0 py-0">
      <div className=" bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] ">
        <ImageSlider images={sliderImages} count={3} />

        <div className="mt-0 px-2 pb-2">
          <div className="flex flex-col gap-1.5 ">
            <div className="max-w-3xl space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Best Seller
              </p>
              <h1 className="text-[15px] sm:text-[25px] font-semibold leading-tight text-slate-950">
                Premium Service with Expert Guidance
              </h1>
            </div>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-[10px] sm:text-sm font-semibold text-gray-700">
                ★ {rating} ({reviewCount.toLocaleString()}K reviews) 
              </span>
            </div>
          </div>

            <div className="flex gap-1.5 text-right ">
              <p className="text-[10px] sm:text-[15px] text-gray-900 ">Starts at </p>
              <p className="text-[10px] sm:text-[15px] text-gray-900 ">
                {startingPrice}
              </p>
            </div>
          </div>

          

        </div>
      </div>
    </section>
  );
}
