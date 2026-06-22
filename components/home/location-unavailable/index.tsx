"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Send, CheckCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ACTIVE_AREAS, COMING_SOON_CITIES } from "@/utils/data";
import { cn } from "@/lib/utils";


export default function LocationUnavailable() {
    const { setLocation } = useCart();
    const [email, setEmail] = useState("");
    const [notified, setNotified] = useState(false);

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setNotified(true);
            setEmail("");
        }
    };

    return (
        <section className="w-full min-h-[80vh] flex flex-col items-center justify-center py-16 bg-gradient-to-b from-stone-50/40 via-white to-stone-50/20 font-sans select-none">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl text-center space-y-8">
                
                {/* 3D Clay Illustration Display */}
                <div className="relative w-52 h-52 mx-auto animate-bounce-slow">
                    <Image
                        src="/images/3d_wellness.png"
                        alt="Vellora Location Availability"
                        fill
                        className="object-contain"
                        priority
                        loading="eager"
                        sizes="sm"
                    />
                    <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent blur-2xl pointer-events-none" />
                </div>

                {/* Text Headline Header */}
                <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider leading-none">
                        📍 Coming Soon to You
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Not available in your area yet
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed font-medium">
                        Vellora is launching in new areas super fast. Leave your email below and we'll let you know the second we go live in your neighborhood.
                    </p>
                </div>

                {/* Notify Me Form wrapper */}
                <div className="max-w-md mx-auto w-full">
                    {notified ? (
                        <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-sm font-semibold animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Subscribed! We'll notify you the moment we launch here.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleNotify} className="flex gap-2 p-1.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus-within:border-amber-400 focus-within:shadow-md transition-all">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 min-w-0"
                            />
                            <button
                                type="submit"
                                className="bg-[#111111] hover:bg-black text-white text-xs font-bold px-5 h-9.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer border-none shadow-xs shrink-0"
                            >
                                Notify Me <Send className="w-3 h-3" />
                            </button>
                        </form>
                    )}
                </div>

                {/* Supported Delhi areas section */}
                <div className="pt-6 space-y-4">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                        Check Vellora Live in Delhi NCR
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ACTIVE_AREAS.map((area) => (
                            <button
                                key={area.name}
                                onClick={() => setLocation(area.full)}
                                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-stone-150 bg-white hover:border-amber-300 hover:shadow-md transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300 border border-stone-100">
                                    <Image
                                        src={area.icon}
                                        alt={area.name}
                                        fill
                                        sizes="48px"
                                        className="object-contain p-1"
                                    />
                                </div>
                                <span className="text-[12px] font-bold text-gray-800 text-center leading-tight group-hover:text-amber-500 transition-colors">
                                    {area.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Coming soon Cities listing */}
                <div className="border-t border-stone-100 pt-8 space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 text-left">We are live in</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {COMING_SOON_CITIES.map((item) => (
                            <div
                                key={item.city}
                                className={cn(
                                    "p-5 rounded-3xl border border-gray-100 text-left bg-gradient-to-br flex flex-col justify-between h-32 relative overflow-hidden shadow-xs group",
                                    item.gradient
                                )}
                            >
                                <div className="space-y-1 z-10">
                                    <h4 className="font-extrabold text-gray-900 text-base">{item.city}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{item.areas}</p>
                                </div>
                                <button
                                    onClick={() => setNotified(true)}
                                    className="w-fit inline-flex items-center gap-1 text-[11px] font-extrabold text-[#111111] hover:text-amber-600 transition-colors z-10 border-none bg-transparent p-0 cursor-pointer"
                                >
                                    Notify Me <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-105 transition-transform">
                                    <MapPin className="w-20 h-20 text-gray-900" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);
}
