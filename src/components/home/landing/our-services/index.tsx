"use client";

import Image from "next/image";
import Link from "next/link";
import type { HomeCategory } from "@/src/types/serviceTypes";
import SectionHeading from "../section-heading";

// Figma "Our services": three rounded-32 cards on alternating tints. The
// card content is data-backed — one card per live category — while the
// tint + fallback illustration are positional.
const CARD_BG = ["bg-tint-blush", "bg-tint-cream", "bg-[#F2F3F4]"];
// TODO(figma-asset): real per-category illustrations. Falls back to the
// category's own iconKey, then a local placeholder.
const FALLBACK_IMG = [
  "/images/spa/spa2.png",
  "/images/massage/massage2.png",
  "/images/physiotherapy/physio2.png",
];

type OurServicesProps = {
  categories: HomeCategory[];
};

export default function OurServices({ categories }: OurServicesProps) {
  // Every live category (Figma shows three; the row wraps for more).
  const cards = categories;
  if (cards.length === 0) return null;

  return (
    <section id="our-services" className="w-full scroll-mt-[80px] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading eyebrow="What we offer?" title="Our Services" />

        <div className="mt-12 flex flex-wrap justify-center gap-8 lg:gap-12">
          {cards.map((category, i) => (
            <Link
              key={category.id}
              href={`/detail/${category.slug}?categoryId=${encodeURIComponent(category.id)}`}
              className={`group flex w-full max-w-[297px] flex-col items-center rounded-[32px] ${CARD_BG[i % 3]} px-8 pb-9 pt-9 text-center transition-transform duration-300 hover:-translate-y-1`}
            >
              {/* Icon floats directly on the card — no background box. */}
              <div className="relative h-[165px] w-[172px]">
                <Image
                  src={FALLBACK_IMG[i % 3]}
                  alt={category.name}
                  fill
                  sizes="172px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-[20px] font-medium text-espresso">
                {category.title ?? category.name}
              </h3>
              <p className="mt-2 max-w-[233px] text-[14px] leading-[1.2] text-muted-ink">
                {category.subtitle ??
                  "Relaxing therapies for natural glow and renewal at your doorstep"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
