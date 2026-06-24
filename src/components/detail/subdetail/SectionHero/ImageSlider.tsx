"use client";

import { useMemo, useState } from "react";

type ImageSliderProps = {
  images: string[];
  count: number;
};

export default function ImageSlider({ images, count }: ImageSliderProps) {
  const slides = useMemo(() => {
    const selected = images.slice(0, count).filter(Boolean);
    if (selected.length === 0) {
      return ["/images/detail/massage_detail.png"];
    }
    return selected;
  }, [images, count]);

  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div className="relative">
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-50">
        <img
          src={slides[activeIndex]}
          alt={`Slide ${activeIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {slides.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={prevSlide}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-black/80 cursor-pointer"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-black/80 cursor-pointer"
              aria-label="Next image"
            >
              ›
            </button>
          </div>

          <div className="mt-3 flex justify-center gap-1.5 px-4 pb-2">
            {slides.map((_, index) => (
              <button
                key={`slide-dot-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-amber-500 w-3" : "bg-slate-300"
                }`}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
