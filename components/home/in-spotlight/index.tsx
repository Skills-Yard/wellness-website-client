"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import { SPOTLIGHT_CARDS } from '@/utils/data';

import 'swiper/css';

export default function Inspotlight() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-8 max-w-7xl mx-auto select-none overflow-hidden border-y border-stone-100 bg-stone-50/40">

      {/* Section Header Wrapper */}
      <div className="flex relative sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
        <div className="flex-1">
          <span className="text-amber-600 font-bold text-xs sm:text-xs md:text-sm uppercase tracking-widest block mb-1 sm:mb-2">
            Premium Selection
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            In the Spotlight
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 sm:mt-2.5 font-medium max-w-2xl leading-relaxed">
            Handpicked premium experiences and consultations curated just for you
          </p>
        </div>

        {/* Slider Controls */}
        <div className="absolute sm:relative right-0 top-0 flex items-center gap-2 select-none flex-shrink-0">
          <button
            type="button"
            className="swiper-spotlight-prev h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg sm:rounded-xl border border-gray-200 shadow-xs bg-white hover:bg-gray-50 text-gray-700 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
          <button
            type="button"
            className="swiper-spotlight-next h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg sm:rounded-xl border border-gray-200 shadow-xs bg-white hover:bg-gray-50 text-gray-700 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
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
          slidesPerView={1}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 14 },
            640: { slidesPerView: 1.5, spaceBetween: 14 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 2.5, spaceBetween: 16 },
            1280: { slidesPerView: 3, spaceBetween: 20 },
          }}
          className="w-full"
        >
          {SPOTLIGHT_CARDS.map((card) => {
            const textColor = card.isDarkText ? "text-gray-900" : "text-white";
            const subColor = card.isDarkText ? "text-gray-500 font-medium" : "text-white/80 font-medium";
            const btnClass = card.isDarkText
              ? "bg-amber-500 text-white hover:bg-amber-600 border-none cursor-pointer"
              : "bg-white text-gray-900 hover:bg-stone-50 border-none cursor-pointer";

            return (
              <SwiperSlide key={card.id} className="h-auto">
                <div className="group cursor-pointer select-none h-full">
                  {/* Card Container */}
                  <div
                    className={`relative h-[180px] sm:h-[200px] md:h-[220px] w-full overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md flex ${card.bg}`}
                  >
                    {/* Floating Custom Badge */}
                    {card.badge && (
                      <div className={`absolute left-3 sm:left-5 top-2 sm:top-4 z-10 rounded-full px-2.5 sm:px-3 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider border uppercase ${card.isDarkText
                        ? "bg-amber-100 border-amber-200 text-amber-800"
                        : "bg-white/10 border-white/10 backdrop-blur-md text-white"
                        }`}>
                        {card.badge}
                      </div>
                    )}

                    <div className="flex h-full w-full">
                      {/* Left Content Area */}
                      <div className="flex w-[58%] flex-col justify-between p-3 sm:p-5 pt-8 sm:pt-12">
                        <div className="space-y-1 sm:space-y-1.5">
                          <h3 className={`text-[12px] sm:text-base md:text-lg font-bold leading-snug tracking-tight line-clamp-2 ${textColor}`}>
                            {card.title}
                          </h3>
                          <p className={`text-[10px] sm:text-[12px] leading-relaxed line-clamp-2 ${subColor}`}>
                            {card.subtitle}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          className={`w-fit font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl px-3 sm:px-4 h-7 sm:h-8 shadow-none transition-transform active:scale-95 ${btnClass}`}
                        >
                          {card.cta}
                        </Button>
                      </div>

                      {/* Right Graphics/Image Area */}
                      <div className="relative w-[42%] h-full overflow-hidden">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          sizes="(max-width: 640px) 30vw, (max-width: 1024px) 25vw, 20vw"
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