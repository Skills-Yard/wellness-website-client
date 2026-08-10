"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { HomeCampaign, HomeCategory } from "@/src/types/serviceTypes";
import CampaignVideo from "@/src/components/media/CampaignVideo";

interface HeroSliderProps {
    campaigns: HomeCampaign[];
    categories: HomeCategory[];
}

const campaignHref = (campaign: HomeCampaign, categories: HomeCategory[]) => {
    const category = categories.find((item) => item.id === campaign.categoryId);

    if (category) {
        const params = new URLSearchParams({ categoryId: category.id });
        if (campaign.subCategoryId) params.set("subCategoryId", campaign.subCategoryId);
        if (campaign.serviceItemId) {
            params.set("id", campaign.serviceItemId);
        }
        return `/detail/${category.slug}?${params.toString()}`;
    }

    return campaign.ctaDeeplink?.startsWith("/") ? campaign.ctaDeeplink : null;
};

export default function HeroSlider({ campaigns, categories }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const orderedCampaigns = useMemo(
        () => [...campaigns]
            .filter((campaign) => campaign.isActive !== false)
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
        [campaigns],
    );

    useEffect(() => {
        if (orderedCampaigns.length < 2) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % orderedCampaigns.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [orderedCampaigns.length]);

    useEffect(() => {
        setCurrentSlide(0);
    }, [campaigns]);

    if (orderedCampaigns.length === 0) {
        return (
            <div className="flex h-60 items-end bg-neutral-950 px-5 pb-5 text-white">
                <div>
                    <h2 className="text-xl font-extrabold text-amber-100">Wellness at your doorstep</h2>
                    <p className="mt-1 text-[11px] font-semibold text-white/80">New campaigns will appear here shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-60 bg-neutral-950 overflow-hidden">
            {orderedCampaigns.map((campaign, index) => {
                const href = campaignHref(campaign, categories);

                return (
                <div
                    key={campaign.id}
                    className={cn(
                        "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out",
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    )}
                >
                    {campaign.cdnUrl && campaign.mediaType === "VIDEO" ? (
                        <CampaignVideo
                            src={campaign.cdnUrl}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : campaign.cdnUrl ? (
                        <Image
                            src={campaign.cdnUrl}
                            alt={campaign.title}
                            fill
                            priority={index === 0}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : null}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

                    {/* Slide Text */}
                    <div className="absolute bottom-4 left-5 right-5 text-white space-y-1 z-20">
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md text-amber-100">
                            {campaign.title}
                        </h2>
                        <p className="text-white/80 text-[11px] sm:text-xs font-semibold drop-shadow-sm max-w-[85%]">
                            {campaign.subtitle}
                        </p>
                        {href && campaign.ctaText && (
                            <Link
                                href={href}
                                className="mt-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-stone-900 shadow-sm"
                            >
                                {campaign.ctaText}
                            </Link>
                        )}
                    </div>
                </div>
                );
            })}

            {/* Dot Navigation */}
            <div className="absolute bottom-4 right-2 z-20 flex gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/5">
                {orderedCampaigns.map((campaign, index) => (
                    <button
                        key={campaign.id}
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
