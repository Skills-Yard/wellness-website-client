"use client";

import { LOCATIONS } from "@/src/utils/data";
import { CartItem, CartContextType } from "@/src/utils/types";
import { cartApi, type CartApiItem } from "@/src/services/cartApi";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext<CartContextType | undefined>(undefined);

// A freshly-added item gets this client-generated composite id optimistically
// (see addToCart), before the server has assigned — and syncCart's PATCH
// /cart response has returned — a real one. Real backend ids are plain
// CUIDs with no dashes, so this also doubles as a way to detect "this item
// hasn't synced yet" (see isPendingSync below).
const buildLocalCartItemId = (item: {
    serviceItemId?: string;
    durationId?: string;
    packageId?: string;
    addOnIds?: string[];
}) =>
    `${item.serviceItemId}-${item.durationId}-${item.packageId}-${(item.addOnIds ?? []).join("-")}`;

/** True until the cart has synced with the server and this item has a real
 *  id. Per-item actions that target one item by id — delete, slot update —
 *  should stay disabled until then: calling them earlier sends this
 *  composite placeholder as the id, which the backend won't recognize. */
export const isPendingSync = (item: CartItem) => item.id === buildLocalCartItemId(item);

const toCartItem = (item: CartApiItem): CartItem => ({
    id: item.id ?? buildLocalCartItemId(item),
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
    slotDate: item.slotDate,
    slotStartTime: item.slotStartTime,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [location, setLocationState] = useState("");
    const [isLocationDetected, setIsLocationDetected] = useState<boolean | null>(null);
    const [isManuallySelected, setIsManuallySelected] = useState(false);
    const [zoneId, setZoneIdState] = useState<string | null>(null);
    // The zone the server-side cart is actually pinned to — see
    // CartContextType.cartZoneId for why this is kept separate from `zoneId`.
    const [cartZoneId, setCartZoneId] = useState<string | null>(null);
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
                // Read straight from storage, not the zoneId state variable —
                // this effect only ever runs once on mount, so it closes over
                // zoneId's initial (null) value regardless of what the
                // sibling "load from localStorage" effect sets moments later;
                // state updates from that effect aren't visible here until
                // the next render, but the raw value is already on disk.
                const response = await cartApi.get(
                    accessToken,
                    localStorage.getItem("vellora_zone_id"),
                );
                setCartItems(response.data.items.map(toCartItem));
                setCartId(response.data.id ?? response.data.cartId ?? null);
                setAddressId(response.data.addressId ?? null);
                setCartZoneId(response.data.zoneId ?? null);
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
                    // Without these, any bulk sync (add to cart, quantity
                    // change, address/schedule change) rebuilds this item
                    // without its already-picked slot — if the backend
                    // treats the items array as the item's full state
                    // rather than a merge, that silently clears a slot a
                    // separate updateItem call had just set, racing
                    // whichever response lands last.
                    ...(item.slotDate ? { slotDate: item.slotDate } : {}),
                    ...(item.slotStartTime ? { slotStartTime: item.slotStartTime } : {}),
                }]
                : [],
        );

        if (!accessToken) return;

        // Empty string (the initial state, and what's on-screen before the
        // user has picked anything) is not a valid ISO 8601 date — the
        // backend 400s the whole request on scheduledDate: "" rather than
        // treating it as "not set", which used to silently break every
        // sync (nothing ever got past this to reconcile item ids). Omit
        // these fields entirely instead of sending them empty.
        const resolvedScheduledDate = details.scheduledDate ?? scheduledDate;
        const resolvedScheduledTime = details.scheduledTime ?? scheduledTime;
        const resolvedCouponCode = details.couponCode ?? couponCode;

        try {
            const response = await cartApi.update({
                items: apiItems,
                ...(selectedAddressId ? { addressId: selectedAddressId } : {}),
                ...(resolvedScheduledDate ? { scheduledDate: resolvedScheduledDate } : {}),
                ...(resolvedScheduledTime ? { scheduledTime: resolvedScheduledTime } : {}),
                isOnDemand: details.isOnDemand ?? isOnDemand,
                ...(resolvedCouponCode ? { couponCode: resolvedCouponCode } : {}),
            }, accessToken, cartZoneId ?? zoneId);
            // Reconcile with the server's real item ids. addToCart etc. set a
            // client-generated composite id optimistically (see toCartItem) —
            // deleteItem/updateItem target a real backend id, so without this
            // a freshly-added item's id would never match and removing it
            // (or picking a slot for it) would silently fail against the API.
            if (response?.data?.items) {
                setCartItems(response.data.items.map(toCartItem));
                // Keep in sync every time — this is the source of truth for
                // which zone slot reservation will check capacity against,
                // and it can change out from under us (e.g. updateCartAddress
                // switching to an address in a different zone).
                setCartZoneId(response.data.zoneId ?? null);
            } else {
                // If this fires, PATCH /cart's response doesn't actually
                // carry data.items the way CartResponse assumes — item ids
                // never get reconciled with the server's real ones, and
                // every later delete/slot-update call will 404 against a
                // client-generated id that was never real to begin with.
                console.warn(
                    "cartApi.update response had no data.items — cart item ids will not be reconciled with the server.",
                    response,
                );
            }
        } catch (error) {
            // The cart remains available locally if the server update fails.
            console.error("Failed to sync cart with the server", error);
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
        const item = cartItems.find((i) => i.id === id);
        setCartItems((prev) => prev.filter((i) => i.id !== id));

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;
        if (item && isPendingSync(item)) {
            // Nothing to delete server-side yet — the add hasn't synced (or
            // is still in flight), so there's no real id for DELETE
            // /cart/items/{id} to target. Local removal above covers it.
            console.warn(
                "Skipped cart item delete — item hasn't synced with the server yet",
                id,
            );
            return;
        }
        // Real delete, not the bulk PATCH /cart other mutations use here —
        // that only ever sent the trimmed items array along for the ride,
        // which silently did nothing to remove anything server-side.
        void cartApi.deleteItem(id, accessToken, cartZoneId ?? zoneId).catch((error) => {
            // Local removal stands either way, but log this — a failed
            // delete here means the item comes back on the next cart load.
            console.error("Failed to delete cart item", id, error);
        });
    };

    // Shared by increase/decreaseQuantity below. Targets this one item via
    // PATCH /cart/items/{itemId} (cartApi.updateItem) instead of the bulk
    // PATCH /cart syncCart uses — a quantity bump doesn't need to touch
    // every other item in the cart. Reads cartItems directly (not a
    // functional setCartItems update) for the same reason updateItemSlot
    // does: this needs the current item's slotDate/slotStartTime to carry
    // along, and a functional updater's callback can't see that.
    const updateQuantity = (id: string, nextQuantity: number) => {
        const updatedItems = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: nextQuantity } : item,
        );
        setCartItems(updatedItems);

        const item = updatedItems.find((i) => i.id === id);
        const accessToken = localStorage.getItem("accessToken");
        if (!item || !accessToken) return;

        if (isPendingSync(item) || !item.serviceItemId || !item.durationId || !item.packageId) {
            // No real backend id yet for /cart/items/{id} to target — falls
            // back to the bulk sync (same call addToCart makes) so this
            // quantity still reaches the server once the item itself syncs.
            void syncCart(updatedItems);
            return;
        }

        cartApi
            .updateItem(
                id,
                {
                    serviceItemId: item.serviceItemId,
                    durationId: item.durationId,
                    packageId: item.packageId,
                    addOnIds: item.addOnIds ?? [],
                    quantity: nextQuantity,
                    // PATCH /cart/items/{id} takes a full item
                    // representation, not a partial patch — omitting these
                    // would clear a slot updateItemSlot had already set for
                    // this item.
                    ...(item.slotDate ? { slotDate: item.slotDate } : {}),
                    ...(item.slotStartTime ? { slotStartTime: item.slotStartTime } : {}),
                },
                accessToken,
                cartZoneId ?? zoneId,
            )
            .then((response) => {
                if (response?.data?.items) {
                    setCartItems(response.data.items.map(toCartItem));
                }
            })
            .catch((error) => {
                // Local quantity change stands either way, but log this — a
                // failed update here means it isn't actually saved.
                console.error("Failed to update cart item quantity", id, error);
            });
    };

    const increaseQuantity = (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item) return;
        updateQuantity(id, item.quantity + 1);
    };

    const decreaseQuantity = (id: string) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item || item.quantity <= 1) return;
        updateQuantity(id, item.quantity - 1);
    };

    const clearCart = () => {
        setCartItems([]);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;
        void cartApi.clearItems(accessToken, cartZoneId ?? zoneId).catch((error) => {
            // Local clear stands either way, but log this — a failed clear
            // here means the items come back on the next cart load.
            console.error("Failed to clear cart items", error);
        });
    };

    const updateItemSlot = (id: string, slotDate: string, slotStartTime: string) => {
        // Computed explicitly, not read back from the cartItems state
        // variable — this function calls syncCart (via the cart-wide
        // schedule sync below) in the same tick as the setCartItems call
        // right after this, and state updates aren't visible in this
        // closure until the next render. Using the stale list here would
        // send this bulk sync without the slot just picked for this item,
        // and (in a race with the per-item updateItem call below) could
        // have it come back and overwrite the slot that call just set.
        const updatedItems = cartItems.map((item) =>
            item.id === id ? { ...item, slotDate, slotStartTime } : item,
        );
        setCartItems(updatedItems);

        // Booking creation reads the cart-level scheduledDate/scheduledTime,
        // not this item's slotDate/slotStartTime — checkout never sends its
        // own scheduledDate, so the backend falls back to cart.scheduledDate
        // (see BookingService.create) and 400s "scheduledDate is required"
        // if that's still empty. Keep it in sync with whichever slot was
        // picked most recently so picking a slot here actually unblocks
        // checkout, instead of also requiring the separate on-demand
        // date/time fields to be filled in. Calls syncCart directly (not
        // updateCartSchedule, which would use the stale cartItems above)
        // with updatedItems so this bulk sync carries the just-picked slot.
        setScheduledDate(slotDate);
        setScheduledTime(slotStartTime);
        setIsOnDemand(false);
        void syncCart(updatedItems, addressId, {
            scheduledDate: slotDate,
            scheduledTime: slotStartTime,
            isOnDemand: false,
        });

        const item = updatedItems.find((i) => i.id === id);
        const accessToken = localStorage.getItem("accessToken");
        if (!item || !item.serviceItemId || !item.durationId || !item.packageId || !accessToken)
            return;
        if (isPendingSync(item)) {
            // The "Select time slot" button in CartView is always clickable
            // (no isPendingSync gate there anymore) — this check is what
            // actually stops a not-yet-synced item's composite placeholder
            // id from being sent as {itemId}, which would 404. The slot
            // stays picked locally either way; it just doesn't reach the
            // server until this item's own add-to-cart sync reconciles a
            // real id (see the reconcile step in syncCart above).
            console.warn(
                "Skipped slot update — item hasn't synced with the server yet",
                id,
            );
            return;
        }

        cartApi
            .updateItem(
                id,
                {
                    serviceItemId: item.serviceItemId,
                    durationId: item.durationId,
                    packageId: item.packageId,
                    addOnIds: item.addOnIds ?? [],
                    quantity: item.quantity,
                    slotDate,
                    slotStartTime,
                },
                accessToken,
                cartZoneId ?? zoneId,
            )
            .then((response) => {
                if (response?.data?.items) {
                    setCartItems(response.data.items.map(toCartItem));
                }
            })
            .catch((error) => {
                // Local slot selection stands either way, but log this — a
                // failed update here means the slot isn't actually saved.
                console.error("Failed to update cart item slot", id, error);
            });
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
                cartZoneId,
                cartId,
                addressId,
                updateCartAddress,
                scheduledDate,
                scheduledTime,
                isOnDemand,
                couponCode,
                updateCartSchedule,
                updateItemSlot,
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
