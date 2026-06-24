import { CategoryServiceItem, BentoCardItem } from "@/src/utils/types";

export const HEADER_CATEGORIES: CategoryServiceItem[] = [
    {
        id: 1,
        label: "Massage Therapy",
        image: "/images/3d_massage.png",
        badge: "Popular",
        badgeColor: "bg-amber-500",
        bg: "bg-white border border-gray-150/60 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5",
        path:"/detail?type=massage"
    },
    {
        id: 2,
        label: "Wellness & Spa",
        image: "/images/3d_wellness.png",
        badge: "New",
        badgeColor: "bg-emerald-500",
        bg: "bg-white border border-gray-150/60 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5",
        path:"/detail?type=wellness"
    },
    {
        id: 3,
        label: "Physiotherapy",
        image: "/images/3d_physio.png",
        badge: "Certified",
        badgeColor: "bg-blue-500",
        bg: "bg-white border border-gray-150/60 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5",
        path:"/detail?type=physio"
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
