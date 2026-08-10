"use client";

import { Clock, Star } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useCart } from "@/src/context/CartContext";
import { PHYSIO_SERVICES } from "@/src/utils/data";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";

export default function PhysioServices() {
    const { addToCart } = useCart();
    const router = useRouter();

    return (
        <section
            id="physiotherapy"
            className="w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-8 max-w-7xl mx-auto font-sans select-none overflow-hidden border-b border-stone-100 bg-white"
        >
            {/* Section Header Wrapper */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                <div className="flex-1">
                    <span className="text-blue-600 font-bold text-xs sm:text-xs md:text-sm uppercase tracking-widest block mb-1 sm:mb-2">
                        Clinical Recovery
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Physiotherapy & Rehab
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 sm:mt-2.5 font-medium max-w-2xl leading-relaxed max-sm:hidden">
                        Doctor-prescribed treatment, joint adjustments, and active movement programs at home.
                    </p>
                </div>

            </div>

            {/* Swiper Slider Relative Shell */}
            <div className="relative w-full">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: ".swiper-physio-prev",
                        nextEl: ".swiper-physio-next",
                    }}
                    spaceBetween={12}
                    slidesPerView={1}
                    breakpoints={{
                        320: { slidesPerView: 2.12, spaceBetween: 14 },
                        640: { slidesPerView: 2, spaceBetween: 14 },
                        768: { slidesPerView: 3, spaceBetween: 14 },
                        1024: { slidesPerView: 4, spaceBetween: 16 },
                        1280: { slidesPerView: 5, spaceBetween: 20 },
                    }}
                    className="w-full"
                >
                    {PHYSIO_SERVICES.map((item) => {
                        const hasDiscount = !!(item.originalPrice && item.originalPrice > item.price);

                        return (
                            <SwiperSlide key={item.id} className="h-auto">
                                <div
                                    onClick={() => router.push(`/detail/physio?id=${item.id}`)}
                                    className="group cursor-pointer select-none flex flex-col justify-between h-full"
                                >
                                    <div>
                                        {/* Aspect Ratio Square Image Frame */}
                                        <div className="relative max-sm:max-h-22 aspect-square w-full rounded-sm sm:rounded-2xl overflow-hidden bg-stone-100 mb-2 sm:mb-3 md:mb-4">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={400}
                                                height={400}
                                                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                            />
                                            <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2.5 bg-black/60 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold text-white px-1.5 sm:px-2 py-0.5 rounded-md flex items-center gap-0.5 sm:gap-1">
                                                <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-blue-400" />
                                                {item.duration}
                                            </span>
                                        </div>

                                        {/* Text Information Stack */}
                                        <div className="space-y-1 relative sm:space-y-1.5">
                                            <h3 className="text-[12px] sm:text-[13px] max-sm:line-clamp-1 md:text-sm lg:text-base font-semibold text-gray-900 line-clamp-1 leading-snug tracking-tight group-hover:text-blue-600 transition-colors">
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
                                    <div className="flex items-center justify-between gap-2 mt-0.5 flex-wrap">
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
                                        <Button
                                            type="button"
                                            size={"sm"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart({
                                                    id: item.id.toString() + "-massage",
                                                    title: item.title,
                                                    price: item.price,
                                                    image: item.image,
                                                    duration: item.duration,
                                                });
                                            }}
                                            className="max-sm:hidden"
                                        >
                                            Book
                                        </Button>
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
