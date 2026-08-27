"use client";

import Link from "next/link";
import { MapPin, ChevronDown, User, Search, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { LOCATIONS, UNSUPPORTED_LOCATIONS } from "@/src/utils/data";
import { SearchableService } from "@/src/hooks/queries/useServiceSearchIndex";
import { useCart } from "@/src/context/CartContext";
import { useAddresses } from "@/src/hooks/queries/useAddresses";
import { formatAddressLabel } from "@/src/services/addressApi";
import NotificationBell from "@/src/components/notifications/NotificationBell";

interface MobileHeaderProps {
    location: string;
    setLocation: (loc: string) => void;
    isMounted: boolean;
    headerScrolled: boolean;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    searchFocused: boolean;
    setSearchFocused: (f: boolean) => void;
    onSearchFocus: () => void;
    searchResults: SearchableService[];
    isSearchIndexLoading: boolean;
    onSuggestionClick: (suggestion: SearchableService) => void;
}

export default function MobileHeader({
    location,
    setLocation,
    isMounted,
    headerScrolled,
    searchQuery,
    setSearchQuery,
    searchFocused,
    setSearchFocused,
    onSearchFocus,
    searchResults,
    isSearchIndexLoading,
    onSuggestionClick,
}: MobileHeaderProps) {
    const { addressId, updateCartAddress } = useCart();
    const { data: addressesData } = useAddresses();
    const addresses = addressesData ?? [];
    const selectedSavedAddress = addresses.find((address) => address.id === addressId) ?? null;
    const displayLocation = selectedSavedAddress
        ? formatAddressLabel(selectedSavedAddress)
        : location;

    return (
        <div
            className={cn(
                "fixed top-0 left-0 right-0 z-30 transition-all duration-300 px-4",
                headerScrolled
                    ? "bg-white border-b border-stone-150 shadow-xs pt-2.5 pb-2.5 text-stone-900"
                    : "bg-gradient-to-b from-black/80 via-black/35 to-transparent pt-5 pb-4 text-white"
            )}
        >
            {/* Top Row: Location & Cart */}
            <div
                className={cn(
                    "flex items-center justify-between transition-all duration-300 ease-in-out",
                    headerScrolled
                        ? "max-h-0 opacity-0 mb-0 pointer-events-none"
                        : "max-h-16 opacity-100 mb-4"
                )}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex flex-col cursor-pointer max-w-[80%]">
                            <span className="text-[20px] font-semibold leading-5 text-white flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                In 15 Minutes
                            </span>
                            <span className="text-[14px] font-medium text-white flex items-center gap-1 truncate mt-1">
                                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span className="truncate">{isMounted ? displayLocation : LOCATIONS[0]}</span>
                                <ChevronDown className="w-3 h-3 text-stone-300 shrink-0" />
                            </span>
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="start"
                        className="w-64 rounded-2xl p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border-gray-100 bg-white z-50"
                    >
                        {addresses.length > 0 && (
                            <>
                                <div className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50/50 rounded-lg select-none mb-1">
                                    Your Addresses
                                </div>
                                {addresses.map((address) => (
                                    <DropdownMenuItem
                                        key={address.id}
                                        onClick={() => updateCartAddress(address.id)}
                                        className={cn(
                                            "cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors",
                                            addressId === address.id &&
                                            "bg-amber-50 text-amber-600 font-medium focus:bg-amber-50 focus:text-amber-600"
                                        )}
                                    >
                                        <MapPin className="w-3.5 h-3.5 opacity-50 shrink-0 text-amber-500" />
                                        <span className="truncate">
                                            {address.label ?? address.customLabel ?? formatAddressLabel(address)}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                            </>
                        )}
                        <div className="px-2.5 py-1 text-[10px] font-bold text-amber-600 bg-amber-50/50 rounded-lg select-none mb-1 mt-2.5">
                            Active Areas
                        </div>
                        {LOCATIONS.map((loc) => (
                            <DropdownMenuItem
                                key={loc}
                                onClick={() => setLocation(loc)}
                                className={cn(
                                    "cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 transition-colors",
                                    location === loc &&
                                    "bg-amber-50 text-amber-600 font-medium focus:bg-amber-50 focus:text-amber-600"
                                )}
                            >
                                <MapPin className="w-3.5 h-3.5 opacity-50 shrink-0 text-emerald-500" />
                                <span className="truncate">{loc}</span>
                            </DropdownMenuItem>
                        ))}

                        <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 rounded-lg select-none mt-2.5 mb-1 border-t border-gray-50 pt-2">
                            Coming Soon
                        </div>
                        {UNSUPPORTED_LOCATIONS.map((loc) => (
                            <DropdownMenuItem
                                key={loc}
                                onClick={() => setLocation(loc)}
                                className={cn(
                                    "cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 focus:bg-gray-50 focus:text-gray-900 transition-colors",
                                    location === loc && "bg-amber-50 text-amber-600 font-medium"
                                )}
                            >
                                <MapPin className="w-3.5 h-3.5 opacity-50 shrink-0 text-gray-300" />
                                <span className="truncate">{loc}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Grouped in their own flex container with a tight gap —
                    the parent row is justify-between, which would otherwise
                    space these two as far apart as the location content on
                    the left leaves room for, instead of keeping them
                    together as one pair pushed to the edge. */}
                <div className="flex shrink-0 items-center gap-2">
                    {/* Profile — cart moved to BottomNav (Home/Bookings/
                        Cart), but notifications stay here alongside it,
                        same as before. NotificationBell tracks its own
                        unread count/login-gating internally, so no extra
                        badge wiring here. */}
                    <Link
                        href="/profile"
                        className="flex h-8.25 w-8.25 shrink-0 items-center justify-center rounded-[5px] border border-[#EDEDED] bg-white text-black hover:bg-stone-50"
                        aria-label="Profile"
                    >
                        <User className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </Link>

                    {isMounted && (
                        <NotificationBell className="rounded-full bg-white shadow-sm border-none" />
                    )}
                </div>
            </div>

            {/* Search Row */}
            <div className="relative">
                <div className="flex h-10.75 items-center px-3.5 gap-2 rounded-lg bg-white border border-stone-250/30 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20">
                    <Search className="w-5 h-5 text-stone-400 shrink-0" />
                    <Input
                        placeholder="Search for Services (e.g., Spa for Women)"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            onSearchFocus();
                        }}
                        onFocus={onSearchFocus}
                        className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-black/36 placeholder:font-medium outline-none border-none shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0"
                    />
                    {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery("")} className="cursor-pointer">
                            <X className="w-4 h-4 text-stone-400 hover:text-stone-600" />
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {searchFocused && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 z-50 p-1.5 max-h-[250px] overflow-y-auto">
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-stone-50 mb-1">
                            <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">
                                Services List
                            </span>
                            <button
                                type="button"
                                onClick={() => setSearchFocused(false)}
                                className="text-xs text-stone-500 font-bold hover:text-stone-800"
                            >
                                Close
                            </button>
                        </div>
                        {!searchQuery && (
                            <p className="text-xs text-stone-400 py-4 text-center">
                                Start typing to search services…
                            </p>
                        )}
                        {searchQuery && isSearchIndexLoading && searchResults.length === 0 && (
                            <p className="text-xs text-stone-400 py-4 text-center">
                                Searching…
                            </p>
                        )}
                        {searchResults.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                type="button"
                                onClick={() => onSuggestionClick(suggestion)}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                            >
                                <Search className="w-3.5 h-3.5 opacity-40 shrink-0" />
                                <span className="truncate flex-1">{suggestion.name}</span>
                                <span className="shrink-0 text-[10px] text-stone-400">
                                    {suggestion.categoryName}
                                </span>
                            </button>
                        ))}
                        {searchQuery && !isSearchIndexLoading && searchResults.length === 0 && (
                            <p className="text-xs text-stone-400 py-4 text-center">
                                No results found for &quot;{searchQuery}&quot;
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
