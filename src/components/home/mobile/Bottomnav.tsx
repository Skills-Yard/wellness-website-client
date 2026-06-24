import {
    Home as HomeIcon,
    Flower2,
    Sparkles,
    ShoppingCart,
    User,
    Activity,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface BottomNavProps {
    activeTab: string;
    onTabClick: (id: string) => void;
}
//dddd
export default function BottomNav({
    activeTab,
    onTabClick,
}: BottomNavProps) {
    const handleNavClick = (tabId: string) => {
        onTabClick(tabId);
    };

    const navItems = [
        {
            id: "top",
            label: "Home",
            icon: HomeIcon,
            color: "amber",
        },
        {
            id: "massage",
            label: "Massage",
            icon: Flower2,
            color: "amber",
        },
        {
            id: "wellness",
            label: "Wellness",
            icon: Sparkles,
            color: "emerald",
        },
        {
            id: "physiotherapy",
            label: "Physio",
            icon: Activity,
            color: "blue",
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-100 flex justify-around py-2.5 px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            {navItems.map(({ id, label, icon: Icon, color }) => {
                const isActive = activeTab === id || (id === "top" && activeTab === "home");
                const colorClasses = {
                    amber: isActive ? "text-amber-500" : "text-stone-400",
                    emerald: isActive ? "text-emerald-500" : "text-stone-400",
                    blue: isActive ? "text-blue-500" : "text-stone-400",
                };

                return (
                    <button
                        key={id}
                        onClick={() => handleNavClick(id)}
                        className={cn(
                            "flex flex-col items-center gap-1 flex-1 py-1 transition-colors duration-200 cursor-pointer active:scale-90",
                            colorClasses[color as keyof typeof colorClasses]
                        )}
                        type="button"
                        aria-label={label}
                    >
                        <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                        <span className="text-[9px] font-bold">{label}</span>
                    </button>
                );
            })}

            <Link
                href="/profile"
                className={cn(
                    "flex flex-col items-center gap-1 flex-1 py-1 transition-colors duration-200 cursor-pointer active:scale-90",
                    activeTab === "profile" ? "text-stone-900" : "text-stone-400"
                )}
            >
                <User className="w-4.5 h-4.5" strokeWidth={1.5} />
                <span className="text-[9px] font-bold">Profile</span>
            </Link>
        </nav>
    );
}