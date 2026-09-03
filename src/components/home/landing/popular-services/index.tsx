"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import type { HomeCategory, HomeServiceItem } from "@/src/types/serviceTypes";
import ServiceCard from "@/src/components/home/service-card";
import { toDynamicService } from "@/src/utils/service/card";
import SubDetailPopUp from "@/src/components/detail/[slug]/LazySubDetailPopUp";
import SectionHeading from "../section-heading";

// Figma "Frame 394": a trending row of service cards for one category.
// Same card + in-place detail popup as the mobile category rows
// (components/home/category-services) — only the surrounding band differs.
type PopularServicesProps = {
  category: HomeCategory;
  services: HomeServiceItem[];
  sectionId?: string;
};

const POPULAR_IMAGE_SIZES =
  "(max-width: 767px) 80vw, (max-width: 1023px) 33vw, 23vw";

export default function PopularServices({
  category,
  services,
  sectionId,
}: PopularServicesProps) {
  const [selected, setSelected] = useState<HomeServiceItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const name = category.title ?? category.name;
  const items = services.slice(0, 10);
  if (items.length === 0) return null;

  return (
    <section id={sectionId} className="w-full scroll-mt-[80px] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading eyebrow="Trending" title={`Most Popular ${name} Services`} />

        <div className="mt-12">
          <Swiper
            spaceBetween={16}
            slidesPerView={1.15}
            breakpoints={{
              640: { slidesPerView: 2.15, spaceBetween: 20 },
              768: { slidesPerView: 3.15, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 26 },
            }}
            onSlideChange={(swiper: SwiperInstance) =>
              setActiveIndex(swiper.activeIndex)
            }
            className="w-full"
          >
            {items.map((service) => (
              <SwiperSlide key={service.id} className="h-auto">
                <ServiceCard
                  service={service}
                  categoryName={name}
                  onSelect={setSelected}
                  imageSizes={POPULAR_IMAGE_SIZES}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {items.length > 4 && (
            <div className="mt-8 flex justify-center gap-2">
              {items.map((item, i) => (
                <span
                  key={item.id}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex ? "w-6 bg-brand-strong" : "w-2 bg-[#AFAEAE]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <SubDetailPopUp
          service={toDynamicService(selected, name)}
          serviceDetails={{
            durations: selected.durations ?? [],
            packages: selected.packages ?? [],
            addOns: selected.addOns ?? [],
          }}
          categoryName={name}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
