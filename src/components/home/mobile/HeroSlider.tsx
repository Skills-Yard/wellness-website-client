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

// Always returns a usable href — a global campaign (no categoryId) with no
// ctaDeeplink set previously made this return null, which hid the CTA button
// entirely even though ctaText was present. Falls back to "/" instead so the
// button never silently disappears.
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

    return campaign.ctaDeeplink?.startsWith("/") ? campaign.ctaDeeplink : "/";
};

export default function HeroSlider({ campaigns, categories }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const orderedCampaigns = useMemo(
        () => [...campaigns]
            .filter(
                (campaign) =>
                    (campaign.type === "CAROUSEL_VIDEO" || campaign.type === "CAROUSEL_BANNER") &&
                    campaign.isActive !== false,
            )
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
            <div className="flex h-70 items-end bg-neutral-950 px-4 pb-4 font-sans text-white">
                <div>
                    <h2 className="text-lg font-semibold leading-[1.125] text-[#FFC558]">Wellness at your doorstep</h2>
                    <p className="mt-1 text-sm font-semibold text-white">New campaigns will appear here shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-70 bg-neutral-950 overflow-hidden font-sans">
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

                    {/* Brown gradient — dark at the top (under the header
                        controls) and bottom (under the campaign text),
                        clear through the middle. Matches the Figma spec
                        (rgba(107,75,34,…)). */}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(107,75,34,0.62)_0%,rgba(107,75,34,0.42)_30%,rgba(107,75,34,0)_50%,rgba(107,75,34,0)_68%,rgba(107,75,34,0.42)_85%,rgba(107,75,34,0.62)_100%)]" />

                    {/* Campaign title + subtitle — tap to open the campaign.
                        Sits above the slide dashes (which are pinned lower
                        right), so it can use the full width and truncate. */}
                    <Link
                        href={href}
                        className="absolute bottom-6 left-4 right-4 z-20 block text-white"
                    >
                        <h2 className="truncate text-lg font-semibold leading-[1.125] tracking-tight text-[#FFC558] drop-shadow-md">
                            {campaign.title}
                        </h2>
                        <p className="mt-1 truncate text-sm font-semibold text-white drop-shadow-sm">
                            {campaign.subtitle}
                        </p>
                    </Link>
                </div>
                );
            })}

            {/* Slide indicators — dashes, active one amber and wider. */}
            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
                {orderedCampaigns.map((campaign, index) => (
                    <button
                        key={campaign.id}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                            "h-1 rounded-full transition-all duration-300 cursor-pointer",
                            index === currentSlide ? "w-5 bg-[#FFC558]" : "w-2.5 bg-[#ABABAB]"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
