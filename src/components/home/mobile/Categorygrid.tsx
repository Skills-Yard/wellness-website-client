import Image from "next/image";
import Link from "next/link";

const mobileCategories = [
    {
        id: "wellness",
        label: "Spa",
        image: "/images/spa/spa.webp",
        target: "wellness",
        badgeColor: "bg-emerald-500",
        path: 'detail?type=wellness',

    },
    {
        id: "massage",
        label: "Massage ",
        image: "/images/massage/massage.webp",
        target: "massage",
        badgeColor: "bg-amber-500",
        path: '/detail?type=massage',
    },
    {
        id: "physio",
        label: "Physiotherapy",
        image: "/images/physiotherapy/physiotherapy.webp",
        target: "physiotherapy",
        badgeColor: "bg-blue-500",
        path: '/detail?type=physio',

    },
];


export default function CategoryGrid() {
    return (
        <div className="relative p-4 z-20 flex item-center justify-between w-full bg-white mt-5">
            <div className="grid grid-cols-3  item-center w-full  place-content-center place-items-center mx-auto">
                {mobileCategories.map((cat) => (
                    <Link href={cat.path} key={cat.id} className="w-full mx-auto ">
                        <button
                            className="flex flex-col  w-full items-center group cursor-pointer"
                        >
                            <div className="relative w-20 h-20 sm:w-14 sm:h-14 rounded-xl bg-stone-100 group-hover:bg-amber-50/30 flex items-center justify-center overflow-hidden border border-stone-100/40 shadow-2xs group-hover:border-amber-200 transition-all duration-300">
                                <Image
                                    src={cat.image}
                                    alt={cat.label}
                                    fill
                                    className="object-cover"
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