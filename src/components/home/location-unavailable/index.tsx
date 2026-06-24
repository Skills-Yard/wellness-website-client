"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Send, CheckCircle, X } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { ACTIVE_AREAS, COMING_SOON_CITIES } from "@/src/utils/data";
import { cn } from "@/src/lib/utils";

interface LocationUnavailableModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LocationUnavailableModal({ isOpen, onClose }: LocationUnavailableModalProps) {
    const { setLocation } = useCart();
    const [email, setEmail] = useState("");
    const [notified, setNotified] = useState(false);

    if (!isOpen) return null;

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setNotified(true);
            setTimeout(() => {
                setEmail("");
                setNotified(false);
                onClose();
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 space-y-8">
                    
                    {/* 3D Clay Illustration */}
                    <div className="relative w-40 h-40 mx-auto rounded-3xl overflow-hidden border border-stone-150/40 shadow-md">
                        <Image
                            src="/images/wellness_category.png"
                            alt="Vellora Location Availability"
                            className="object-cover"
                            fill
                        />
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
                            📍 Coming Soon to You
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            Not available in your area yet
                        </h2>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                            Select your area to get started. We're expanding fast!
                        </p>
                    </div>

                    {/* Notify Form */}
                    <div className="max-w-md mx-auto w-full">
                        {notified ? (
                            <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-sm font-semibold">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Subscribed! We'll notify you soon.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleNotify} className="flex gap-2 p-1.5 rounded-2xl bg-gray-50 border border-gray-200">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#111111] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                                >
                                    <Send className="w-3 h-3" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Areas Grid */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                            Select Your Area
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {ACTIVE_AREAS.map((area) => (
                                <button
                                    key={area.name}
                                    onClick={() => {
                                        setLocation(area.full);
                                        onClose();
                                    }}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:border-amber-300 hover:shadow-md hover:bg-amber-50/30 transition-all group"
                                >
                                    <MapPin className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-bold text-gray-800 text-center">
                                        {area.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}