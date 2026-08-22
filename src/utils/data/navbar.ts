import { NavLinkType } from "@/src/utils/types";

export const NAV_LINKS: NavLinkType[] = ["Massage", "Wellness", "Physiotherapy"];

// Display label shown in the navbar, kept separate from the link's own
// value so renaming what's shown doesn't touch anything that value is used
// as a key for elsewhere (SERVICE_SUGGESTIONS, the `active` nav state, …).
export const NAV_LINK_LABELS: Record<NavLinkType, string> = {
    Massage: "Massage",
    Wellness: "Spa",
    Physiotherapy: "Physiotherapy",
};

// The id of the home-page section each nav link scrolls to — the live
// category's own `slug` from the backend (see CategoryServices'
// `id={category.slug}`), NOT just `link.toLowerCase()`. The "Wellness" nav
// entry's category was renamed "Spa" on the backend (slug "spa") without
// the NavLinkType key changing, so it no longer matches its own lowercased
// name — this is the one place that mapping is allowed to drift from the
// display label, so every scroll-to-section consumer (desktop Navbar,
// BottomNav, useMobileHome) reads it from here instead of hardcoding its
// own copy of "wellness".
export const NAV_LINK_SECTION_IDS: Record<NavLinkType, string> = {
    Massage: "massage",
    Wellness: "spa",
    Physiotherapy: "physiotherapy",
};

export const LOCATIONS = [
    "H37, Block H- Saket, Delhi",
    "Connaught Place, New Delhi",
    "Lajpat Nagar, New Delhi",
    "Vasant Kunj, New Delhi",
    "Burari, Delhi",
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
