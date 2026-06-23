"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const slides = [
    {
        type: "video",
        src: "https://assets.mixkit.co/videos/preview/mixkit-massage-therapy-in-a-beautiful-spa-salon-40176-large.mp4",
        title: "Spring '26 Collection",
        subtitle: "Bespoke spa treatments in the comfort of your home",
    },
    {
        type: "photo",
        src: "/images/slider_spa_room.png",
        title: "Luxury Massage Therapy",
        subtitle: "Certified clinical experts at your doorstep",
    },
    {
        type: "video",
        src: "https://assets.mixkit.co/videos/preview/mixkit-masseur-applying-massage-oil-on-womans-back-40170-large.mp4",
        title: "Premium Relaxation",
        subtitle: "Relieve stress, tension & fatigue instantly",
    },
    {
        type: "photo",
        src: "/images/slider_facial_glow.png",
        title: "Gold Radiance Facials",
        subtitle: "Dermatologist-approved organic beauty glow",
    },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[240px] bg-neutral-950 overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out",
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    )}
                >
                    {slide.type === "video" ? (
                        <video
                            src={slide.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={slide.src}
                            alt={slide.title}
                            fill
                            priority={index === 0}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

                    {/* Slide Text */}
                    <div className="absolute bottom-4 left-5 right-5 text-white space-y-1 z-20">
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md text-amber-100">
                            {slide.title}
                        </h2>
                        <p className="text-white/80 text-[11px] sm:text-xs font-semibold drop-shadow-sm max-w-[85%]">
                            {slide.subtitle}
                        </p>
                    </div>
                </div>
            ))}

            {/* Dot Navigation */}
            <div className="absolute bottom-4 right-2 z-20 flex gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/5">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                            index === currentSlide ? "bg-amber-400 w-3.5" : "bg-white/40"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}