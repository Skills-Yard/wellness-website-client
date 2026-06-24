import Image from "next/image";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

const mobileCategories = [
    {
        id: "massage",
        label: "Massage Therapy",
        image: "/images/3d_massage.png",
        target: "massage",
        badge: "Popular",
        badgeColor: "bg-amber-500",
        path: '/detail?type=massage',
    },
    {
        id: "wellness",
        label: "Wellness & Spa",
        image: "/images/3d_wellness.png",
        target: "wellness",
        badge: "New",
        badgeColor: "bg-emerald-500",
        path: 'detail?type=wellness',

    },
    {
        id: "physio",
        label: "Physiotherapy",
        image: "/images/3d_physio.png",
        target: "physiotherapy",
        badge: "Certified",
        badgeColor: "bg-blue-500",
        path: '/detail?type=physio',

    },
];

interface CategoryGridProps {
    onCategoryClick: (target: string) => void;
}

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
    return (
        <div className="relative p-4 z-20 flex item-center justify-between w-full bg-white">
            <div className="grid grid-cols-3  item-center w-full  place-content-center place-items-center mx-auto">
                {mobileCategories.map((cat) => (
                    <Link href={cat.path} key={cat.id} className="w-full mx-auto ">
                        <button
                            className="flex flex-col  w-full items-center group cursor-pointer"
                        >
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-sm bg-stone-100 group-hover:bg-amber-50/30 flex items-center justify-center overflow-hidden border border-stone-100/40 shadow-2xs group-hover:border-amber-200 transition-all duration-300">
                                {cat.badge && (
                                    <span
                                        className={cn(
                                            "absolute top-0 left-1/2 -translate-x-1/2 text-[7px] uppercase font-black text-white px-1.5 py-0.5 rounded-b-md leading-none tracking-wider scale-90",
                                            cat.badgeColor
                                        )}
                                    >
                                        {cat.badge}
                                    </span>
                                )}
                                <Image
                                    src={cat.image}
                                    alt={cat.label}
                                    width={48}
                                    height={48}
                                    className="object-contain p-1"
                                />
                            </div>
                            <span className="text-[10px] font-extrabold text-stone-600 text-center leading-tight mt-1.5 group-hover:text-amber-500 transition-colors line-clamp-2">
                                {cat.label}
                            </span>
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}