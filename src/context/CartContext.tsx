"use client";

import { LOCATIONS } from "@/src/utils/data";
import { CartItem, CartContextType } from "@/src/utils/types";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [location, setLocationState] = useState("");
    const [isLocationDetected, setIsLocationDetected] = useState<boolean | null>(null);
    const [isManuallySelected, setIsManuallySelected] = useState(false);

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
        const storedManual = localStorage.getItem("vellora_manual_location");

        if (storedLoc) {
            setLocationState(storedLoc);
            setIsManuallySelected(storedManual === "true");
        } else {
            setLocationState(LOCATIONS[0]);
            setIsManuallySelected(false);
        }

        setIsHydrated(true);
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

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
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
                clearCart,
                location,
                setLocation,
                isLocationSupported,
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