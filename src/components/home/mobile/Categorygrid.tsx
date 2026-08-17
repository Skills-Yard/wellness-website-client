"use client";

import { useState } from "react";
import Image from "next/image";
import { HomeCategory } from "@/src/types/serviceTypes";
import CategorySelectModal from "@/src/components/home/category-select/CategorySelectModal";

interface CategoryGridProps {
  categories: HomeCategory[];
  zoneId: string;
}

export default function CategoryGrid({ categories, zoneId }: CategoryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<HomeCategory | null>(null);

  return (
    <div className="relative z-20 mt-5 bg-white p-4">
      {categories.length > 0 ? (
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 place-items-center">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className="flex w-full flex-col items-center group cursor-pointer"
            >
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shadow-sm transition-all duration-300 group-hover:border-amber-200 group-hover:bg-amber-50">
                {category.iconKey ? (
                  <Image
                    src={category.iconKey}
                    alt={category.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xl font-bold text-amber-500">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <span className="mt-1 text-center text-[11px] font-semibold leading-tight text-stone-700 transition-colors duration-300 group-hover:text-amber-500 line-clamp-2">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="w-full py-3 text-center text-xs font-medium text-stone-500">
          No service categories available.
        </p>
      )}

      {selectedCategory && (
        <CategorySelectModal
          category={selectedCategory}
          zoneId={zoneId}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}
