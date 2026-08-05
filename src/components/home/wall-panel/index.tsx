import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { HomeCampaign, HomeCategory } from "@/src/types/serviceTypes";

type WallPanelProps = {
    campaign: HomeCampaign;
    category: HomeCategory;
};

export default function WallPanel({ campaign, category }: WallPanelProps) {
    const image = campaign.cdnUrl ?? campaign.s3Key;
    const categoryName = `${category.name} ${category.slug}`.toLowerCase();
    const isPhysio = categoryName.includes("physio");
    const isSpa = !isPhysio && (categoryName.includes("spa") || categoryName.includes("wellness") || categoryName.includes("beauty"));
    const mobileTheme = isPhysio
        ? {
            background: "radial-gradient(88.83% 430.76% at 11.17% 78.28%, #FFFFFF 0%, rgba(120, 148, 170, 0.7) 40.99%, #E5E8E9 100%)",
            badge: "SELF-CARE SPOTLIGHT",
            eyebrow: "Relief that helps you move",
            title: "Move better. Feel stronger.",
            accent: "#204390",
            badgeClass: "left-[11px] top-[33px] bg-white text-black",
            copyClass: "left-[11px] top-[64px] text-black/75",
            titleClass: "left-[11px] top-[82px] max-w-[145px] leading-5",
            buttonClass: "left-[11px] top-[134px]",
            imageClass: "bottom-2 left-[39%] h-[137px] w-[222px]",
            imageSize: "222px",
        }
        : isSpa
            ? {
                background: "radial-gradient(86.87% 419.05% at 13.13% 69.33%, #FFF5EB 0%, rgba(255, 217, 197, 0.76) 40.99%, rgba(255, 219, 219, 0.98) 100%)",
                badge: "FEATURED SPA",
                eyebrow: "Taking care of your",
                title: "Wellbeing.",
                accent: "#904720",
                badgeClass: "left-2 top-[39px] bg-[#EBDAC4] text-[#904720]",
                copyClass: "left-[9px] top-[75px] text-black",
                titleClass: "left-[9px] top-[92px] max-w-[145px] leading-[22px]",
                buttonClass: "left-2 top-[127px]",
                imageClass: "bottom-1 left-[40%] h-[139px] w-[214px]",
                imageSize: "214px",
            }
            : {
                background: "radial-gradient(86.87% 419.05% at 13.13% 69.33%, #FEFEFE 0%, #F5DABA 40.99%, #FDE8CF 100%)",
                badge: "FEATURED MASSAGE",
                eyebrow: "Release tension",
                title: "Restore your balance",
                accent: "#904720",
                badgeClass: "left-2 top-[39px] bg-[#EBDAC4] text-[#904720]",
                copyClass: "left-[9px] top-[75px] text-black",
                titleClass: "left-[9px] top-[92px] max-w-[140px] leading-[22px]",
                buttonClass: "left-2 bottom-[16px]",
                imageClass: "bottom-2 left-[44%] h-[134px] w-[178px]",
                imageSize: "178px",
            };

    if (!image) return null;

    return (
        <section className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
            <div className="relative h-[198px] overflow-hidden rounded-[8px] md:hidden" style={{ background: mobileTheme.background }}>
                <span className={`absolute flex h-5 items-center rounded-[4px] border border-black/[0.09] px-2 text-[10px] font-semibold leading-3 ${mobileTheme.badgeClass}`}>
                    {mobileTheme.badge}
                </span>
                <p className={`absolute text-xs font-medium leading-[15px] ${mobileTheme.copyClass}`}>
                    {mobileTheme.eyebrow}
                </p>
                <h2 className={`absolute font-serif text-xl font-normal ${mobileTheme.titleClass}`} style={{ color: mobileTheme.accent }}>
                    {mobileTheme.title}
                </h2>
                <Link
                    href="/detail/physio"
                    className={`absolute flex h-[31px] w-[108px] items-center justify-center gap-1 rounded-[8px] bg-[#25180F] text-xs font-medium text-white ${mobileTheme.buttonClass}`}
                >
                    Explore Plans <span className="text-base leading-none">›</span>
                </Link>
                <div className={`absolute overflow-hidden ${mobileTheme.imageClass}`}>
                    <Image
                        src={image}
                        alt={campaign.title}
                        fill
                        sizes={mobileTheme.imageSize}
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="relative hidden min-h-[350px] overflow-hidden rounded-tr-xl rounded-bl-xl bg-[#FEF9C3] md:flex md:flex-row items-center justify-between p-4 sm:p-8 md:p-10 gap-0">

                {/* Left Text content */}
                <div className="relative z-10 flex-1 flex flex-col items-start justify-center space-y-5 max-sm:space-y-4 py-4 md:py-6 pl-2 sm:pl-4">
                    <h2 className="text-xl sm:text-4xl lg:text-[40px] font-extrabold text-neutral-900 leading-tight tracking-tight max-w-lg">
                        {campaign.title}
                    </h2>

                    <p className="text-base sm:text-lg text-neutral-800 font-medium tracking-wide">
                        Massage & Spa Packages
                    </p>
                    <Link href="/detail/physio">
                        <Button className="bg-[#111111] text-white hover:bg-black font-bold text-sm h-12 px-8 rounded-xl cursor-pointer transition-all active:scale-95 border-none shadow-sm">
                            Book now
                        </Button>
                    </Link>
                </div>

                {/* Right Image Container */}
                <div className="relative w-full md:w-[48%] aspect-[4/3] sm:aspect-[16/10] md:aspect-[1.4] rounded-tr-xl rounded-bl-xl overflow-hidden bg-neutral-100 shrink-0">
                    <Image
                        src={image}
                        alt={campaign.title}
                        fill
                        sizes="(max-w-7xl) 50vw, 40vw"
                        className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                        priority
                    />
                </div>

            </div>
        </section>
    );
}
