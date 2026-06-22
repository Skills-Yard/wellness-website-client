"use client";

import { LOCATIONS } from "@/utils/data";
import { CartItem, CartContextType } from "@/types";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [location, setLocationState] = useState("");

    // Load from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem("vellora_cart");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart items", e);
            }
        }
        
        const storedLoc = localStorage.getItem("vellora_location");
        if (storedLoc) {
            setLocationState(storedLoc);
        } else {
            setLocationState(LOCATIONS[0]);
        }
        
        setIsHydrated(true);
    }, []);

    // Save to localStorage whenever cartItems changes
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem("vellora_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isHydrated]);

    const setLocation = (loc: string) => {
        setLocationState(loc);
        localStorage.setItem("vellora_location", loc);
    };

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
        setIsCartOpen(true); // Open the drawer immediately for user feedback
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const isLocationSupported = LOCATIONS.includes(location);

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
