import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { HomeCampaign, HomeCategory } from "@/src/types/serviceTypes";
import CampaignVideo from "@/src/components/media/CampaignVideo";

type WallPanelProps = {
    campaign: HomeCampaign;
    category: HomeCategory;
};

export default function WallPanel({ campaign, category }: WallPanelProps) {
    const image = campaign.cdnUrl ?? campaign.s3Key;
    const isVideo = campaign.mediaType === "VIDEO";
    const categoryName = `${category.name} ${category.slug}`.toLowerCase();
    const isPhysio = categoryName.includes("physio");
    const isSpa = !isPhysio && (categoryName.includes("spa") || categoryName.includes("wellness") || categoryName.includes("beauty"));

    // Styling only (position/color/font) — text content itself now comes from the
    // campaign's own fields below, with these as fallbacks for older/incomplete
    // campaigns rather than per-category copy.
    const mobileTheme = isPhysio
        ? {
            eyebrowFallback: "Relief that helps you move",
            titleFallback: "Move better. Feel stronger.",
            accent: "#204390",
            badgeClass: "left-6 top-[33px] bg-white text-black",
            copyClass: "left-6 top-[64px] text-black/75",
            titleClass: "left-6 top-[82px] max-w-[145px] leading-5",
            buttonClass: "left-6 top-[134px]",
        }
        : isSpa
            ? {
                eyebrowFallback: "Taking care of your",
                titleFallback: "Wellbeing.",
                accent: "#904720",
                badgeClass: "left-6 top-[39px] bg-[#EBDAC4] text-[#904720]",
                copyClass: "left-6 top-[75px] text-black",
                titleClass: "left-6 top-[92px] max-w-[145px] leading-[22px]",
                buttonClass: "left-6 top-[127px]",
            }
            : {
                eyebrowFallback: "Release tension",
                titleFallback: "Restore your balance",
                accent: "#904720",
                badgeClass: "left-6 top-[39px] bg-[#EBDAC4] text-[#904720]",
                copyClass: "left-6 top-[75px] text-black",
                titleClass: "left-6 top-[92px] max-w-[140px] leading-[22px]",
                buttonClass: "left-6 bottom-[16px]",
            };

    if (!image) return null;

    const badgeText = `Featured ${category.name}`.toUpperCase();
    const eyebrowText = campaign.subtitle ?? mobileTheme.eyebrowFallback;
    const titleText = campaign.title ?? mobileTheme.titleFallback;
    const ctaText = campaign.ctaText ?? "Explore Plans";
    const href = campaign.ctaDeeplink?.startsWith("/")
        ? campaign.ctaDeeplink
        : `/detail/${category.slug}?categoryId=${encodeURIComponent(category.id)}`;

    return (
        <section className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
            <div className="relative h-[198px] overflow-hidden rounded-[8px] md:hidden">
                {isVideo ? (
                    <CampaignVideo src={image} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <Image
                        src={image}
                        alt={campaign.title ?? titleText}
                        fill
                        sizes="100vw"
                        className="absolute inset-0 object-cover"
                        priority
                    />
                )}
                <span className={`absolute z-10 flex h-5 max-w-[calc(100%-48px)] items-center truncate rounded-[4px] border border-black/[0.09] px-2 text-[10px] font-semibold leading-3 ${mobileTheme.badgeClass}`}>
                    {badgeText}
                </span>
                <p className={`absolute z-10 max-w-[calc(100%-48px)] truncate text-xs font-medium leading-[15px] ${mobileTheme.copyClass}`}>
                    {eyebrowText}
                </p>
                <h2 className={`absolute z-10 truncate font-serif text-xl font-normal ${mobileTheme.titleClass}`} style={{ color: mobileTheme.accent }}>
                    {titleText}
                </h2>
                <Link
                    href={href}
                    className={`absolute z-10 flex h-[31px] w-[108px] items-center justify-center gap-1 rounded-[8px] bg-[#25180F] px-2 text-xs font-medium text-white ${mobileTheme.buttonClass}`}
                >
                    <span className="truncate">{ctaText}</span>
                    <span className="shrink-0 text-base leading-none">›</span>
                </Link>
            </div>

            <div className="relative hidden min-h-[350px] overflow-hidden rounded-tr-xl rounded-bl-xl md:flex md:flex-row items-center p-4 sm:p-8 md:p-10">
                {isVideo ? (
                    <CampaignVideo src={image} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <Image
                        src={image}
                        alt={campaign.title ?? titleText}
                        fill
                        sizes="100vw"
                        className="absolute inset-0 object-cover"
                        priority
                    />
                )}

                {/* Text content */}
                <div className="relative z-10 flex-1 flex flex-col items-start justify-center space-y-5 max-sm:space-y-4 py-4 md:py-6 pl-2 sm:pl-4 max-w-full">
                    <h2 className="w-full truncate text-xl sm:text-4xl lg:text-[40px] font-extrabold text-neutral-900 leading-tight tracking-tight max-w-lg">
                        {titleText}
                    </h2>

                    <p className="w-full truncate text-base sm:text-lg text-neutral-800 font-medium tracking-wide max-w-lg">
                        {eyebrowText}
                    </p>
                    <Link href={href} className="max-w-full">
                        <Button className="max-w-full bg-[#111111] text-white hover:bg-black font-bold text-sm h-12 px-8 rounded-xl cursor-pointer transition-all active:scale-95 border-none shadow-sm">
                            <span className="truncate">{ctaText}</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
