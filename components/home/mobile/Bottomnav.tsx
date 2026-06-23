import {
    Home as HomeIcon,
    Flower2,
    Sparkles,
    ShoppingCart,
    User,
    Activity,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BottomNavProps {
    activeTab: string;
    cartCount: number;
    isMounted: boolean;
    onTabClick: (id: string) => void;
    onCartOpen: () => void;
}

export default function BottomNav({
    activeTab,
    cartCount,
    isMounted,
    onTabClick,
    onCartOpen,
}: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-100 flex justify-around py-2.5 px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] ">
            <button
                onClick={() => onTabClick("top")}
                className={cn(
                    "flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer",
                    activeTab === "home" || activeTab === "top" ? "text-amber-500" : "text-stone-400"
                )}
            >
                <HomeIcon className="w-4.5 h-4.5" />
                <span className="text-[9px] font-bold">Home</span>
            </button>

            <button
                onClick={() => onTabClick("massage")}
                className={cn(
                    "flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer",
                    activeTab === "massage" ? "text-amber-500" : "text-stone-400"
                )}
            >
                <Flower2 className="w-4.5 h-4.5" />
                <span className="text-[9px] font-bold">Massage</span>
            </button>

            <button
                onClick={() => onTabClick("wellness")}
                className={cn(
                    "flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer",
                    activeTab === "wellness" ? "text-emerald-500" : "text-stone-400"
                )}
            >
                <Sparkles className="w-4.5 h-4.5" />
                <span className="text-[9px] font-bold">Wellness</span>
            </button>

            <button
                onClick={() => onTabClick("physiotherapy")}
                className={cn(
                    "flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer",
                    activeTab === "physiotherapy" ? "text-blue-500" : "text-stone-400"
                )}
            >
                <Activity className="w-4.5 h-4.5" />
                <span className="text-[9px] font-bold">Physio</span>
            </button>

            <button className="flex flex-col items-center gap-1 flex-1 py-1 transition-colors cursor-pointer">
                <Link href="/profile" className="flex flex-col items-center gap-1">
                    <User className="w-4.5 h-4.5" />
                    <span className="text-[9px] font-bold">Profile</span>
                </Link>
            </button>
        </div>
    );
}