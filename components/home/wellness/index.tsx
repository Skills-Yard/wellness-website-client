"use client";

import { ChevronLeft, ChevronRight, Star, Clock } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useCart } from "@/context/CartContext";
import { WELLNESS_SERVICES } from "@/utils/data";


export default function WellnessServices() {
    const { addToCart } = useCart();

    return (
        <section
            id="wellness"
            className="w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-8 max-w-7xl mx-auto font-sans select-none overflow-hidden border-b border-stone-100 bg-stone-50/20"
        >
            {/* Section Header Wrapper */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                <div className="flex-1">
                    <span className="text-emerald-600 font-bold text-xs sm:text-xs md:text-sm uppercase tracking-widest block mb-1 sm:mb-2">
                        Luxury Beauty Care
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Wellness & Beauty Escapes
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 sm:mt-2.5 font-medium max-w-2xl leading-relaxed">
                        Recharge your skin and body with our premium dermatologically tested spa essentials.
                    </p>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-2 select-none flex-shrink-0">
                    <button
                        type="button"
                        className="swiper-wellness-prev h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg sm:rounded-xl border border-gray-200 shadow-xs bg-white hover:bg-gray-50 text-gray-700 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                    <button
                        type="button"
                        className="swiper-wellness-next h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg sm:rounded-xl border border-gray-200 shadow-xs bg-white hover:bg-gray-50 text-gray-700 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
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
                        prevEl: ".swiper-wellness-prev",
                        nextEl: ".swiper-wellness-next",
                    }}
                    spaceBetween={12}
                    slidesPerView={1}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 14 },
                        640: { slidesPerView: 2, spaceBetween: 14 },
                        768: { slidesPerView: 3, spaceBetween: 14 },
                        1024: { slidesPerView: 4, spaceBetween: 16 },
                        1280: { slidesPerView: 5, spaceBetween: 20 },
                    }}
                    className="w-full"
                >
                    {WELLNESS_SERVICES.map((item) => {
                        const hasDiscount = !!(item.originalPrice && item.originalPrice > item.price);

                        return (
                            <SwiperSlide key={item.id} className="h-auto">
                                <div className="group cursor-pointer select-none flex flex-col justify-between h-full">
                                    <div>
                                        {/* Aspect Ratio Square Image Frame */}
                                        <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 mb-2 sm:mb-3 md:mb-4">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={400}
                                                height={400}
                                                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                            />
                                            <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2.5 bg-black/60 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold text-white px-1.5 sm:px-2 py-0.5 rounded-md flex items-center gap-0.5 sm:gap-1">
                                                <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                                                {item.duration}
                                            </span>
                                        </div>

                                        {/* Text Information Stack */}
                                        <div className="space-y-1 sm:space-y-1.5">
                                            <h3 className="text-[12px] sm:text-[13px] md:text-sm lg:text-base font-semibold text-gray-900 line-clamp-2 leading-snug tracking-tight group-hover:text-emerald-600 transition-colors">
                                                {item.title}
                                            </h3>

                                            {/* Star Performance Counter Indicator Row */}
                                            <div className="flex items-center space-x-1 text-[11px] sm:text-[12px] md:text-sm text-gray-600">
                                                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                                                <span className="font-semibold text-gray-900">{item.rating.toFixed(2)}</span>
                                                <span className="truncate text-gray-600">({item.reviewsCount})</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Button and Pricing representation Row */}
                                    <div className="flex items-center justify-between gap-2 mt-2.5 flex-wrap">
                                        <div className="flex items-baseline space-x-1 sm:space-x-1.5">
                                            <span className="text-[13px] sm:text-[14px] md:text-base font-bold text-gray-900">
                                                ₹{item.price.toLocaleString('en-IN')}
                                            </span>
                                            {hasDiscount && (
                                                <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-400 line-through font-normal">
                                                    ₹{item.originalPrice?.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart({
                                                    id: item.id.toString() + "-wellness",
                                                    title: item.title,
                                                    price: item.price,
                                                    image: item.image,
                                                    duration: item.duration,
                                                });
                                            }}
                                            className="px-4.5 py-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                                        >
                                            ADD
                                        </button>
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