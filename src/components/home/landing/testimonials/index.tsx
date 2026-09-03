"use client";

import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import type { HomeServiceItem } from "@/src/types/serviceTypes";
import SectionHeading from "../section-heading";

// Figma "Testimonials": pale quote cards over a dimmed spa photo with a
// dot indicator. Quotes are the real customReviews attached to services
// in the catalog — de-duped across the whole list. Hidden when there are
// none.
type TestimonialsProps = {
  services: HomeServiceItem[];
};

export default function Testimonials({ services }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = useMemo(() => {
    const seen = new Set<string>();
    const out: { key: string; name: string; content: string }[] = [];
    for (const service of services) {
      for (const review of service.customReviews ?? []) {
        if (!review.name || !review.content) continue;
        const key = `${review.name}::${review.content}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ key, name: review.name, content: review.content });
      }
    }
    return out;
  }, [services]);

  if (reviews.length === 0) return null;

  return (
    <section
      id="reviews"
      className="relative w-full scroll-mt-[80px] overflow-hidden bg-espresso"
    >
      {/* TODO(figma-asset): dimmed spa background photo */}
      <div className="absolute inset-0 bg-[url('/images/detail/spa_home_banner.png')] bg-cover bg-center opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients say"
          titleClassName="text-white"
        />

        <div className="mt-12">
          <Swiper
            spaceBetween={20}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 2.1, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            onSlideChange={(swiper: SwiperInstance) =>
              setActiveIndex(swiper.activeIndex)
            }
            className="w-full"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.key} className="h-auto">
                <figure className="flex h-full flex-col rounded-2xl bg-white/95 p-6">
                  <blockquote className="text-[13px] leading-[1.7] text-muted-ink">
                    &ldquo;{review.content}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-[13px] font-medium text-espresso">
                    &mdash; {review.name}
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>

          {reviews.length > 4 && (
            <div className="mt-8 flex justify-center gap-2">
              {reviews.map((review, i) => (
                <span
                  key={review.key}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex ? "w-6 bg-brand" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
