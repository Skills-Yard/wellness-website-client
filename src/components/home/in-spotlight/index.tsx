"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { SPOTLIGHT_CARDS } from "@/src/utils/data";

import "swiper/css";

export default function Inspotlight() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-20 px-0 sm:px-6 md:px-8 lg:px-8 max-w-7xl mx-auto select-none overflow-hidden border-y border-stone-100 bg-stone-50/40">
      {/* Section Header Wrapper */}
      <div className="flex relative sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 px-4 sm:px-0 mb-6 sm:mb-8 md:mb-10">
        <div className="flex-1 pr-16 sm:pr-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            In The Spotlight
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 sm:mt-2.5 font-medium max-w-2xl leading-relaxed">
            Handpicked premium experiences and consultations curated just for
            you
          </p>
        </div>

        {/* Slider Controls */}
        <div className="absolute sm:relative right-4 sm:right-0 top-1 sm:top-0 flex items-center gap-2 select-none shrink-0">
          <button
            type="button"
            className="swiper-spotlight-prev h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl border border-gray-200 shadow-xs bg-white hover:bg-gray-50 text-gray-700 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
          <button
            type="button"
            className="swiper-spotlight-next h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl border border-gray-200 shadow-xs bg-white hover:bg-gray-50 text-gray-700 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>

      {/* Swiper Slider Relative Shell */}
      <div className="relative w-full">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-spotlight-prev",
            nextEl: ".swiper-spotlight-next",
          }}
          spaceBetween={12}
          slidesPerView={1.18}
          centeredSlides={isMobile}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 12 },
            480: { slidesPerView: 1.25, spaceBetween: 12 },
            640: { slidesPerView: 1.5, spaceBetween: 14 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 2.5, spaceBetween: 16 },
            1280: { slidesPerView: 3, spaceBetween: 20 },
          }}
          className="w-full"
        >
          {SPOTLIGHT_CARDS.map((card) => {
            const btnClass = card.isDarkText
              ? "bg-amber-500 text-white hover:bg-amber-600 border-none cursor-pointer"
              : "bg-white text-gray-900 hover:bg-stone-50 border-none cursor-pointer";

            return (
              <SwiperSlide key={card.id} className="h-auto flex items-center justify-center">
                <div className="group cursor-pointer select-none h-full px-2 sm:px-0">
                  {/* Card Container */}
                  <div
                    className={`relative border-none h-[200px] sm:h-55 md:h-55 w-full overflow-hidden rounded-xl transition-all duration-300 shadow-sm hover:shadow-md flex ${card.bg}`}
                  >
                    {/* Floating Custom Badge */}
                    {card.badge && (
                      <div
                        className={`absolute left-4 top-3.5 z-10 rounded-full px-3 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase ${
                          card.isDarkText
                            ? "bg-amber-100 border border-amber-200 text-amber-800"
                            : "bg-black/35 backdrop-blur-xs text-white border-none"
                        }`}
                      >
                        {card.badge}
                      </div>
                    )}

                    <div className="relative w-full h-full flex flex-col md:flex-row">
                      {/* Mobile Background Image (absolute on mobile, hidden on desktop) */}
                      <div className="absolute inset-0 block md:hidden">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 1px"
                          className="object-cover object-center"
                          loading="lazy"
                          priority={false}
                        />
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-r from-stone-950/90 via-stone-950/45 to-transparent" />
                      </div>

                      {/* Left Content Area (covers entire card on mobile, 58% on desktop) */}
                      <div className="relative z-10 flex w-full md:w-[58%] h-full flex-col justify-between p-5 sm:p-6 pt-12 sm:pt-14 md:pt-12">
                        {card.isSpecial ? (
                          // Special styled typography (Self care is lifestyle)
                          <div className="space-y-0.5">
                            <span className="text-white text-[16px] xs:text-[18px] sm:text-xl font-medium tracking-wide block font-sans">
                              {card.specialTitle1}
                            </span>
                            <span className="text-[#dfa135] text-[26px] xs:text-[28px] sm:text-3xl font-serif italic block mt-1 leading-tight font-normal">
                              {card.specialTitle2}
                            </span>
                          </div>
                        ) : (
                          // Standard typography
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3
                              className={`text-[15px] sm:text-[17px] md:text-lg font-bold leading-snug tracking-tight line-clamp-2 ${card.isDarkText ? "text-white md:text-gray-900" : "text-white"}`}
                            >
                              {card.title}
                            </h3>
                            <p
                              className={`text-[11px] sm:text-[12px] md:text-[13px] leading-relaxed line-clamp-2 ${card.isDarkText ? "text-white/80 md:text-gray-500" : "text-white/85"}`}
                            >
                              {card.subtitle}
                            </p>
                          </div>
                        )}

                        {card.isSpecial ? (
                          <Button
                            size="sm"
                            className="w-fit font-bold text-[11px] sm:text-xs rounded-xl px-5 h-9 sm:h-9 shadow-none transition-transform active:scale-95 bg-[#231A16] hover:bg-[#342721] text-stone-100 hover:text-white border-none cursor-pointer flex items-center gap-1 mt-3"
                          >
                            {card.cta}{" "}
                            <span className="text-[9px] font-bold">&gt;</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className={`w-fit font-bold text-[11px] sm:text-xs rounded-xl px-5 h-9 sm:h-9 shadow-none transition-transform active:scale-95 mt-3 ${btnClass}`}
                          >
                            {card.cta}
                          </Button>
                        )}
                      </div>

                      {/* Right Graphics/Image Area (Desktop only) */}
                      <div className="relative hidden md:block w-[42%] h-full overflow-hidden">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          sizes="(max-width: 1024px) 25vw, 20vw"
                          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                          priority={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
