import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { HomeCampaign, HomeCategory } from "@/src/types/serviceTypes";
import CampaignVideo from "@/src/components/media/CampaignVideo";

type WallPanelProps = {
  campaign: HomeCampaign;
  category: HomeCategory;
  /** Only the first category's banner is actually above-the-fold — every
   *  later one should lazy-load like any other below-fold image instead
   *  of forcing eager load for all of them. Defaults to false so any
   *  other caller doesn't silently regress to eager-loading. */
  priority?: boolean;
};

export default function WallPanel({
  campaign,
  category,
  priority = false,
}: WallPanelProps) {
  const image = campaign.cdnUrl ?? campaign.s3Key;
  const isVideo = campaign.mediaType === "VIDEO";
  const categoryName = `${category.name} ${category.slug}`.toLowerCase();
  const isPhysio = categoryName.includes("physio");
  const isSpa =
    !isPhysio &&
    (categoryName.includes("spa") ||
      categoryName.includes("wellness") ||
      categoryName.includes("beauty"));

  // Per-category copy fallbacks + mobile-banner colors. The background wash is
  // chosen separately in `bannerBackground` below and is intentionally shared.
  const variant = isPhysio
    ? {
        eyebrowFallback: "Relief that helps you move",
        titleFallback: "Move better. Feel stronger.",
        accent: "#204390",
        badgeBg: "#FFFFFF",
        badgeColor: "#000000",
        eyebrowColor: "rgba(0, 0, 0, 0.74)",
        // Mobile-banner offsets (see Figma frame per category)
        badgeTop: "top-[33px]",
        eyebrowTop: "top-[64px]",
        titleTop: "top-[82px]",
        ctaPos: "bottom-[18%]",
        titleClass: "leading-[19px] line-clamp-2",
      }
    : isSpa
      ? {
          eyebrowFallback: "Taking care of your",
          titleFallback: "Wellbeing.",
          accent: "#904720",
          badgeBg: "#EBDAC4",
          badgeColor: "#904720",
          eyebrowColor: "#000000",
          badgeTop: "top-[39px]",
          eyebrowTop: "top-[75px]",
          titleTop: "top-[92px]",
          ctaPos: "bottom-[10%]",
          titleClass: "leading-[19px] line-clamp-2",
        }
      : {
          eyebrowFallback: "Release tension",
          titleFallback: "Restore balance.",
          accent: "#904720",
          badgeBg: "#EBDAC4",
          badgeColor: "#904720",
          eyebrowColor: "#000000",
          badgeTop: "top-[39px]",
          eyebrowTop: "top-[75px]",
          titleTop: "top-[92px]",
          ctaPos: "bottom-[10%]",
          titleClass: "leading-[19px] line-clamp-2",
        };

  // Each category gets its own wash: physio cool grey-blue, spa warm/pink,
  // massage the neutral cream default.
  const bannerBackground = isPhysio
    ? "radial-gradient(88.83% 430.76% at 11.17% 78.28%, #FFFFFF 0%, rgba(120, 148, 170, 0.7) 40.99%, #E5E8E9 100%)"
    : isSpa
      ? "radial-gradient(86.87% 419.05% at 13.13% 69.33%, #FFF5EB 0%, rgba(255, 217, 197, 0.76) 40.99%, rgba(255, 219, 219, 0.98) 100%)"
      : "radial-gradient(86.87% 419.05% at 13.13% 69.33%, #FEFEFE 0%, #F5DABA 40.99%, #FDE8CF 100%)";

  if (!image) return null;

  const eyebrowText = campaign.subtitle ?? variant.eyebrowFallback;
  const titleText = campaign.title ?? variant.titleFallback;
  // Mobile banner: keep two words on the first line, everything else wraps below.
  const titleWords = titleText.trim().split(/\s+/);
  const mobileTitleLines =
    titleWords.length > 2
      ? [titleWords.slice(0, 2).join(" "), titleWords.slice(2).join(" ")]
      : [titleText];
  const badgeText = `Featured ${category.name}`.toUpperCase();
  const ctaText = campaign.ctaText ?? "Explore Plans";
  const href = campaign.ctaDeeplink?.startsWith("/")
    ? campaign.ctaDeeplink
    : `/detail/${category.slug}?categoryId=${encodeURIComponent(category.id)}`;

  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Mobile banner — badge, serif accent title & CTA on the left, media boxed on the right */}
      <div
        className="relative h-[198px] overflow-hidden rounded-[8px] md:hidden"
        style={{ background: bannerBackground }}
      >
        {isVideo ? (
          <CampaignVideo
            src={image}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={image}
            alt={campaign.title ?? titleText}
            fill
            sizes="100vw"
            className="object-cover"
            priority={priority}
          />
        )}

        <span
          className={`absolute left-6 ${variant.badgeTop} z-10 flex h-5 max-w-[calc(100%-48px)] items-center truncate rounded-[4px] border border-black/[0.09] px-2 text-[10px] font-semibold leading-3`}
          style={{
            backgroundColor: variant.badgeBg,
            color: variant.badgeColor,
          }}
        >
          {badgeText}
        </span>

        <p
          className={`absolute left-6 ${variant.eyebrowTop} z-10 max-w-[52%] truncate text-[11px] font-medium leading-[14px]`}
          style={{ color: variant.eyebrowColor }}
        >
          {eyebrowText}
        </p>

        <h2
          className={`absolute left-6 ${variant.titleTop} z-10 max-w-[52%] font-serif text-lg font-normal ${variant.titleClass}`}
          style={{ color: variant.accent }}
        >
          {mobileTitleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h2>

        <Link
          href={href}
          className={`absolute left-6 ${variant.ctaPos} z-10 flex h-[31px] w-[108px] items-center justify-center gap-1 rounded-[8px] bg-[#25180F] px-2 text-xs font-medium text-white`}
        >
          <span className="truncate">{ctaText}</span>
          <span className="shrink-0 text-base leading-none">›</span>
        </Link>
      </div>

      {/* Desktop banner — full-bleed photo with badge, eyebrow, title & CTA overlaid on the left */}
      <div
        className="relative hidden md:flex flex-row items-center gap-4 sm:gap-6 overflow-hidden rounded-[8px] p-6 sm:p-8 md:p-10 min-h-[350px]"
        style={{ background: bannerBackground }}
      >
        {isVideo ? (
          <CampaignVideo
            src={image}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={image}
            alt={campaign.title ?? titleText}
            fill
            sizes="100vw"
            className="object-cover"
            priority={priority}
          />
        )}

        {/* Text content — left */}
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center space-y-4 sm:space-y-6 py-2 md:py-6 max-w-full">
          <span
            className="order-1 inline-flex w-fit items-center rounded-[4px] border border-black/[0.09] px-3 py-1.5 text-sm font-semibold leading-4"
            style={{
              backgroundColor: variant.badgeBg,
              color: variant.badgeColor,
            }}
          >
            {badgeText}
          </span>

          <p
            className="order-2 w-full truncate text-2xl sm:text-3xl lg:text-4xl font-medium tracking-wide max-w-xl"
            style={{ color: variant.eyebrowColor }}
          >
            {eyebrowText}
          </p>

          <h2
            className="order-3 w-full truncate text-4xl sm:text-5xl lg:text-6xl font-serif font-normal leading-tight tracking-tight max-w-xl"
            style={{ color: variant.accent }}
          >
            {titleText}
          </h2>

          <Link href={href} className="order-4 max-w-full">
            <Button className="max-w-full bg-[#111111] text-white hover:bg-black font-bold text-sm sm:text-base h-11 sm:h-13 px-6 sm:px-9 rounded-lg sm:rounded-xl cursor-pointer transition-all active:scale-95 border-none shadow-sm">
              <span className="truncate">{ctaText}</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
