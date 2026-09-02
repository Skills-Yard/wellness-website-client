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
                "fixed top-0 left-0 right-0 z-30 transition-all duration-300 px-4 font-sans",
                headerScrolled
                    ? "bg-white border-b border-stone-150 shadow-xs pt-2.5 pb-2.5 text-stone-900"
                    : "bg-transparent pt-5 pb-4 text-white"
            )}
        >
            {/* Top Row: Location & Cart */}
            <div
                className={cn(
                    "flex items-center justify-between gap-3 transition-all duration-300 ease-in-out",
                    headerScrolled
                        ? "max-h-0 opacity-0 mb-0 pointer-events-none"
                        : "max-h-16 opacity-100 mb-4"
                )}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex min-w-0 flex-1 flex-col cursor-pointer">
                            <span className="truncate text-xl font-semibold leading-5 text-white">
                                In 15 Minutes
                            </span>
                            <span className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm font-medium text-white">
                                <svg
                                    viewBox="0 0 384 512"
                                    aria-hidden="true"
                                    className="h-4 w-4 shrink-0 fill-current"
                                >
                                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                </svg>
                                <span className="min-w-0 truncate">{isMounted ? displayLocation : LOCATIONS[0]}</span>
                                <ChevronDown className="h-3 w-3 shrink-0" />
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

                {/* Profile + notifications — cart lives in BottomNav. Both
                    tiles share the same 33px / rounded-[5px] / #EDEDED
                    style. */}
                <div className="flex shrink-0 items-center gap-2">
                    <Link
                        href="/profile"
                        className="flex h-8.25 w-8.25 shrink-0 items-center justify-center rounded-[5px] border border-[#EDEDED] bg-white text-black hover:bg-stone-50"
                        aria-label="Profile"
                    >
                        <User className="h-4 w-4" strokeWidth={1.5} />
                    </Link>

                    {isMounted && (
                        <NotificationBell className="h-8.25 w-8.25 rounded-[5px] border border-[#EDEDED] bg-white text-black hover:bg-stone-50" />
                    )}
                </div>
            </div>

            {/* Search Row */}
            <div className="relative">
                <div className="flex h-10.75 items-center gap-1.5 rounded-lg bg-white px-3 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20">
                    <Search className="h-5 w-5 shrink-0 text-stone-400" />
                    <Input
                        placeholder="Search for Services (e.g., Spa for Women)"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            onSearchFocus();
                        }}
                        onFocus={onSearchFocus}
                        className="h-auto min-w-0 flex-1 border-none bg-transparent p-0 text-sm font-medium text-stone-900 shadow-none outline-none placeholder:font-medium placeholder:text-black/36 focus-visible:ring-0 focus-visible:ring-offset-0"
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
