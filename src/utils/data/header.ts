import { CategoryServiceItem, BentoCardItem } from "@/src/utils/types";

export const HEADER_CATEGORIES: CategoryServiceItem[] = [
    {
        id: 1,
        label: "Massage",
        image: "/images/massage/massage.webp",
        badge: "Popular",
        badgeColor: "bg-amber-500",
        bg: "bg-white border border-gray-150/60 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5",
        path:"/detail/massage"
    },
    {
        id: 2,
        label: "Spa",
        image: "/images/spa/spa.webp",
        badge: "New",
        badgeColor: "bg-emerald-500",
        bg: "bg-white border border-gray-150/60 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5",
        path:"/detail/wellness"
    },
    {
        id: 3,
        label: "Physiotherapy",
        image: "/images/physiotherapy/physiotherapy.webp",
        badge: "Certified",
        badgeColor: "bg-blue-500",
        bg: "bg-white border border-gray-150/60 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5",
        path:"/detail/physio"
    },
];

export const HEADER_BENTO_CARDS: BentoCardItem[] = [
    {
        id: 1,
        title: "Wellness & Beauty",
        subtitle: "Feel renewed, inside out",
        img: "/images/wellness_facial.png",
        borderRounded: "rounded-tl-xl"
    },
    {
        id: 2,
        title: "Massage Therapy",
        subtitle: "Deep relief, expert hands",
        img: "/images/massage_swedish.png",
        borderRounded: "rounded-r-xl"
    },
    {
        id: 3,
        title: "Physiotherapy & Rehab",
        subtitle: "Recover stronger & pain-free",
        img: "/images/physio_back_pain.png",
        borderRounded: "rounded-bl-xl"
    },
];
