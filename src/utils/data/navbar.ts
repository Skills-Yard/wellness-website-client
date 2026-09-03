import { NavLinkType } from "@/src/utils/types";

// Navbar display order: Spa (key "Wellness"), then Massage, then
// Physiotherapy. This only drives the order of the quick-jump buttons;
// it's independent of the order the category sections render in on the
// home page (that comes from the backend catalog).
export const NAV_LINKS: NavLinkType[] = ["Wellness", "Massage", "Physiotherapy"];

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
// `id={category.slug}`), NOT just `link.toLowerCase()`. Two of the three
// nav entries' backend slugs drift from their NavLinkType key: "Wellness"'s
// category is slug "spa" (renamed on the backend without the key changing),
// and "Physiotherapy"'s category is slug "physio". This is the one place
// that mapping is allowed to drift from the display label, so every
// scroll-to-section consumer (desktop Navbar, BottomNav, useMobileHome)
// reads it from here instead of hardcoding its own copy.
export const NAV_LINK_SECTION_IDS: Record<NavLinkType, string> = {
    Massage: "massage",
    Wellness: "spa",
    Physiotherapy: "physio",
};

// Desktop marketing nav — anchors to sections on the rebuilt desktop
// landing page (components/home/landing/*). Deliberately separate from
// NAV_LINKS above (the category quick-jumps, still used by the mobile tree
// via useMobileHome): different targets, different lifecycle. Each
// `sectionId` must match a landing <section id="…">.
export type DesktopNavLink = { label: string; sectionId: string };

export const DESKTOP_NAV_LINKS: DesktopNavLink[] = [
    { label: "Why Us", sectionId: "why-choose-us" },
    { label: "About Us", sectionId: "expert-care" },
    { label: "Our Services", sectionId: "our-services" },
    { label: "How It Works", sectionId: "how-it-works" },
    { label: "Reviews", sectionId: "reviews" },
];

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
