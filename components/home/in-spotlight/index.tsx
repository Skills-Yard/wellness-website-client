"use client";

import { Button } from '@/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/ui/carousel';
import { SPOTLIGHT_CARDS } from '@/utils/data';
import Image from 'next/image';


export default function Inspotlight() {
  return (
    <section className="w-full py-12 select-none bg-stone-50/40 border-y border-stone-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          {/* Section Header Wrapper */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                In the Spotlight
              </h2>
              <p className="text-sm text-gray-400 font-medium mt-1">
                Handpicked premium experiences and consultations
              </p>
            </div>

            {/* Nav controls */}
            <div className="relative flex items-center space-x-2 h-10">
              <CarouselPrevious className="static translate-y-0 h-9 w-9 border border-gray-200 shadow-sm bg-white hover:bg-gray-50 text-gray-700 transition rounded-xl cursor-pointer" />
              <CarouselNext className="static translate-y-0 h-9 w-9 border border-gray-200 shadow-sm bg-white hover:bg-gray-50 text-gray-700 transition rounded-xl cursor-pointer" />
            </div>
          </div>

          {/* Carousel Track wrapper */}
          <CarouselContent className="-ml-4">
            {SPOTLIGHT_CARDS.map((card, index) => {
              const textColor = card.isDarkText ? "text-gray-900" : "text-white";
              const subColor = card.isDarkText ? "text-gray-500 font-medium" : "text-white/80 font-medium";
              const btnClass = card.isDarkText
                ? "bg-amber-500 text-white hover:bg-amber-600 border-none cursor-pointer"
                : "bg-white text-gray-900 hover:bg-stone-50 border-none cursor-pointer";

              return (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-[90%] sm:basis-[70%] md:basis-[48%] lg:basis-[33.33%]"
                >
                  <div
                    className={`relative h-[220px] w-full overflow-hidden rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md flex ${card.bg}`}
                  >
                    {/* Floating Custom Badge */}
                    {card.badge && (
                      <div className={`absolute left-5 top-4 z-10 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider border uppercase ${card.isDarkText
                          ? "bg-amber-100 border-amber-200 text-amber-800"
                          : "bg-white/10 border-white/10 backdrop-blur-md text-white"
                        }`}>
                        {card.badge}
                      </div>
                    )}

                    <div className="flex h-full w-full">
                      {/* Left Content Area */}
                      <div className="flex w-[58%] flex-col justify-between p-5 pt-12">
                        <div className="space-y-1.5">
                          <h3 className={`text-base sm:text-lg font-bold leading-snug tracking-tight line-clamp-2 ${textColor}`}>
                            {card.title}
                          </h3>
                          <p className={`text-[12px] leading-relaxed line-clamp-2 ${subColor}`}>
                            {card.subtitle}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          className={`w-fit font-bold text-xs rounded-xl px-4.5 h-8.5 shadow-none transition-transform active:scale-95 ${btnClass}`}
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
                          sizes="(max-w-7xl) 20vw, 15vw"
                          className="object-cover object-center transition-transform duration-500 ease-out hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

      </div>
    </section>
  );
}
