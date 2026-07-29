"use client";

import { LOCATIONS } from "@/src/utils/data";
import { CartItem, CartContextType } from "@/src/utils/types";
import { cartApi, type CartApiItem } from "@/src/services/cartApi";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext<CartContextType | undefined>(undefined);

const toCartItem = (item: CartApiItem): CartItem => ({
    id:
        item.id ??
        `${item.serviceItemId}-${item.durationId}-${item.packageId}-${(item.addOnIds ?? []).join("-")}`,
    serviceItemId: item.serviceItemId,
    durationId: item.durationId,
    packageId: item.packageId,
    addOnIds: item.addOnIds ?? [],
    quantity: item.quantity,
    title: item.serviceItem?.title ?? item.serviceItem?.name ?? "Selected service",
    image:
        item.serviceItem?.image ??
        item.serviceItem?.media ??
        "/placeholder.svg",
    duration:
        item.duration?.label ??
        item.duration?.name ??
        item.duration?.title ??
        item.duration?.duration ??
        "Selected duration",
    price: Number(item.package?.price ?? item.serviceItem?.price ?? 0),
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [location, setLocationState] = useState("");
    const [isLocationDetected, setIsLocationDetected] = useState<boolean | null>(null);
    const [isManuallySelected, setIsManuallySelected] = useState(false);
    const [zoneId, setZoneIdState] = useState<string | null>(null);
    const [cartId, setCartId] = useState<string | null>(null);
    const [addressId, setAddressId] = useState<string | null>(null);
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [isOnDemand, setIsOnDemand] = useState(true);
    const [couponCode, setCouponCode] = useState("");

    // Check geolocation on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkGeolocation = () => {
            if (!navigator.geolocation) {
                console.log("Geolocation not available");
                setIsLocationDetected(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Geolocation allowed:", position.coords);
                    setIsLocationDetected(true);
                },
                (error) => {
                    console.log("Geolocation denied:", error.code);
                    // error.code: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
                    setIsLocationDetected(false);
                },
                { timeout: 5000, enableHighAccuracy: false }
            );
        };

        checkGeolocation();
    }, []);

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedCart = localStorage.getItem("vellora_cart");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart items", e);
            }
        }

        const storedLoc = localStorage.getItem("vellora_location");
        const storedZoneId = localStorage.getItem("vellora_zone_id");
        const storedManual = localStorage.getItem("vellora_manual_location");

        if (storedLoc) {
            setLocationState(storedLoc);
            setIsManuallySelected(storedManual === "true");
        } else {
            setLocationState(LOCATIONS[0]);
            setIsManuallySelected(false);
        }

        setZoneIdState(storedZoneId);
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const loadCart = async () => {
            try {
                const response = await cartApi.get(accessToken);
                setCartItems(response.data.items.map(toCartItem));
                setCartId(response.data.id ?? response.data.cartId ?? null);
                setAddressId(response.data.addressId ?? null);
                setScheduledDate(response.data.scheduledDate ?? "");
                setScheduledTime(response.data.scheduledTime ?? "");
                setIsOnDemand(response.data.isOnDemand ?? true);
                setCouponCode(response.data.couponCode ?? "");
            } catch {
                // Retain the locally cached cart if the API is unavailable.
            }
        };

        void loadCart();
    }, []);

    // Save to localStorage whenever cartItems changes
    useEffect(() => {
        if (isHydrated && typeof window !== "undefined") {
            localStorage.setItem("vellora_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isHydrated]);

    const setLocation = useCallback((loc: string) => {
        console.log("Location selected:", loc);
        setLocationState(loc);
        setIsManuallySelected(true);
        if (typeof window !== "undefined") {
            localStorage.setItem("vellora_location", loc);
            localStorage.setItem("vellora_manual_location", "true");
        }
    }, []);

    const setZoneId = useCallback((id: string | null) => {
        setZoneIdState(id);
        if (typeof window !== "undefined") {
            if (id) localStorage.setItem("vellora_zone_id", id);
            else localStorage.removeItem("vellora_zone_id");
        }

    }, []);

    const syncCart = async (
        items: CartItem[],
        selectedAddressId = addressId,
        details: Partial<Pick<import("@/src/services/cartApi").UpdateCartBody, "scheduledDate" | "scheduledTime" | "isOnDemand" | "couponCode">> = {},
    ) => {
        const accessToken = localStorage.getItem("accessToken");
        const apiItems: CartApiItem[] = items.flatMap((item) =>
            item.serviceItemId && item.durationId && item.packageId
                ? [{
                    serviceItemId: item.serviceItemId,
                    durationId: item.durationId,
                    packageId: item.packageId,
                    addOnIds: item.addOnIds ?? [],
                    quantity: item.quantity,
                }]
                : [],
        );

        if (!accessToken) return;
        try {
            await cartApi.update({
                items: apiItems,
                ...(selectedAddressId ? { addressId: selectedAddressId } : {}),
                scheduledDate: details.scheduledDate ?? scheduledDate,
                scheduledTime: details.scheduledTime ?? scheduledTime,
                isOnDemand: details.isOnDemand ?? isOnDemand,
                couponCode: details.couponCode ?? couponCode,
            }, accessToken);
        } catch {
            // The cart remains available locally if the server update fails.
        }
    };

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            const next = existing
                ? prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                )
                : [...prev, { ...item, quantity: 1 }];
            void syncCart(next);
            return next;
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => {
            const next = prev.filter((item) => item.id !== id);
            void syncCart(next);
            return next;
        });
    };

    const increaseQuantity = (id: string) => {
        setCartItems((prev) => {
            const next = prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
            void syncCart(next);
            return next;
        });
    };

    const decreaseQuantity = (id: string) => {
        setCartItems((prev) => {
            const next = prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            void syncCart(next);
            return next;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        void syncCart([]);
    };

    const updateCartAddress = (nextAddressId: string) => {
        setAddressId(nextAddressId);
        void syncCart(cartItems, nextAddressId);
    };

    const updateCartSchedule = (details: {
        scheduledDate?: string;
        scheduledTime?: string;
        isOnDemand?: boolean;
        couponCode?: string;
    }) => {
        if (details.scheduledDate !== undefined) setScheduledDate(details.scheduledDate);
        if (details.scheduledTime !== undefined) setScheduledTime(details.scheduledTime);
        if (details.isOnDemand !== undefined) setIsOnDemand(details.isOnDemand);
        if (details.couponCode !== undefined) setCouponCode(details.couponCode);
        void syncCart(cartItems, addressId, details);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // FIXED: Show unavailable if:
    // 1. Geolocation explicitly denied (isLocationDetected = false) AND
    // 2. User hasn't manually selected location yet
    const isLocationSupported = isManuallySelected || isLocationDetected !== false;

    console.log("Location State:", {
        isLocationDetected,
        isManuallySelected,
        isLocationSupported,
        location
    });

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                isCartOpen,
                setIsCartOpen,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                location,
                setLocation,
                isLocationSupported,
                zoneId,
                setZoneId,
                cartId,
                addressId,
                updateCartAddress,
                scheduledDate,
                scheduledTime,
                isOnDemand,
                couponCode,
                updateCartSchedule,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
