import { ActiveArea, ComingSoonCity } from "@/src/utils/types";
import { LOCATIONS } from "./navbar";

export const ACTIVE_AREAS: ActiveArea[] = [
    { name: "Saket, Delhi", full: LOCATIONS[0], icon: "/images/3d_massage.png" },
    { name: "Connaught Place, Delhi", full: LOCATIONS[1], icon: "/images/3d_wellness.png" },
    { name: "Lajpat Nagar, Delhi", full: LOCATIONS[2], icon: "/images/3d_physio.png" },
    { name: "Vasant Kunj, Delhi", full: LOCATIONS[3], icon: "/images/3d_wellness.png" },
];

export const COMING_SOON_CITIES: ComingSoonCity[] = [
    { city: "Gurugram", areas: "17 areas", gradient: "from-amber-50 to-orange-50/50" },
    { city: "Mumbai", areas: "Coming next month", gradient: "from-blue-50 to-indigo-50/50" },
    { city: "Bangalore", areas: "Q3 Launch", gradient: "from-emerald-50 to-teal-50/50" },
];
