import { NavLinkType } from "@/types";

export const NAV_LINKS: NavLinkType[] = ["Massage", "Wellness", "Physiotherapy"];

export const LOCATIONS = [
    "H37, Block H- Saket, Delhi",
    "Connaught Place, New Delhi",
    "Lajpat Nagar, New Delhi",
    "Vasant Kunj, New Delhi",
];

export const UNSUPPORTED_LOCATIONS = [
    "DLF Phase 3, Gurugram",
    "Andheri West, Mumbai",
    "Indiranagar, Bangalore",
    "Sector 62, Noida",
];

export const SERVICE_SUGGESTIONS: Record<NavLinkType, string[]> = {
    Massage: [
        "Swedish Massage",
        "Deep Tissue Massage",
        "Hot Stone Massage",
        "Aromatherapy Massage",
        "Sports Massage",
        "Thai Massage",
        "Couple Massage",
        "Foot Reflexology",
    ],
    Wellness: [
        "Facial",
        "Body Wrap",
        "Hair Spa",
        "Nail Art",
        "Waxing",
        "Skin Brightening",
        "Scalp Treatment",
        "Detox Therapy",
    ],
    Physiotherapy: [
        "Back Pain Relief",
        "Knee Rehabilitation",
        "Sports Injury",
        "Posture Correction",
        "Neck & Shoulder Pain",
        "Post-Surgery Recovery",
        "Dry Needling",
        "Electrotherapy",
    ],
};
