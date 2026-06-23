"use client";

import { useMemo, useState } from "react";

type ImageSliderProps = {
  images: string[];
  count: number;
};

export default function ImageSlider({ images, count }: ImageSliderProps) {
  const slides = useMemo(() => {
    const selected = images.slice(0, count);
    if (selected.length >= count) {
      return selected;
    }

    return Array.from({ length: count }, (_, index) => 
      selected[index % selected.length] ?? ""
    );
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
      <div className="aspect-[16/9] sm:aspect-[20/9] w-full overflow-hidden bg-slate-100">
        <img
          src={slides[activeIndex]}
          alt={`Slide ${activeIndex + 1}`}
          className="h-full w-full object-cover transition duration-500 ease-out"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={prevSlide}
          className="pointer-events-auto rounded-full bg-slate-950/70 px-3 py-2 text-white transition hover:bg-slate-900"
          aria-label="Previous image"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="pointer-events-auto rounded-full bg-slate-950/70 px-3 py-2 text-white transition hover:bg-slate-900"
          aria-label="Next image"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-2 px-4 pb-3 sm:px-6">
        {slides.map((_, index) => (
          <button
            key={`slide-dot-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === activeIndex ? "bg-slate-950" : "bg-slate-400"
            }`}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
