"use client";

import { LOCATIONS, LOCATION_COORDINATES } from "@/src/utils/data";
import { CartItem, CartContextType } from "@/src/utils/types";
import { cartApi, type CartApiItem } from "@/src/services/cartApi";
import { useZones } from "@/src/hooks/queries/useZones";
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
    // unitPrice is the zone/duration/surge-adjusted price CartService
    // attaches server-side (add-ons already folded in) — prefer it so a
    // zone switch or a duration-only item (no package) reprices correctly.
    // Falls back to the raw base rates only if the server ever omits it.
    price: Number(item.unitPrice ?? item.package?.price ?? item.serviceItem?.price ?? 0),
    slotDate: item.slotDate,
    slotStartTime: item.slotStartTime,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [location, setLocationState] = useState("");
    // Device GPS fix, used only when the user hasn't manually picked a
    // location (see the unified zone-resolution effect below).
    const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [geolocationUnavailable, setGeolocationUnavailable] = useState(false);
    const [isManuallySelected, setIsManuallySelected] = useState(false);
    // Hardcoded lat/lon for whichever location is currently selected (see
    // LOCATION_COORDINATES) — lets a dropdown pick stand in for the
    // device's GPS position when feeding getZones().
    const [locationCoords, setLocationCoords] = useState<{ lat: number; lon: number } | null>(null);
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

    // Resolves the device's GPS position — but only once, and only when no
    // location was manually picked/persisted (checked below via isHydrated,
    // so this doesn't fire, and prompt for permission, before the
    // localStorage read has had a chance to find a saved one). This is now
    // the SINGLE geolocation call for the whole app: page.tsx and
    // spa-booking/index.tsx used to each run their own resolution on top of
    // this, which meant up to two extra permission prompts and duplicate
    // getZones calls for the exact same coordinates.
    useEffect(() => {
        if (!isHydrated) return;
        if (isManuallySelected && locationCoords) return;

        if (typeof window === "undefined" || !navigator.geolocation) {
            setGeolocationUnavailable(true);
            return;
        }

        let isMounted = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!isMounted) return;
                setGpsCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
                setGeolocationUnavailable(false);
            },
            (error) => {
                if (!isMounted) return;
                // error.code: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
                console.warn("Geolocation denied or unavailable:", error.code);
                setGeolocationUnavailable(true);
            },
            { timeout: 5000, enableHighAccuracy: false },
        );

        return () => {
            isMounted = false;
        };
    }, [isHydrated, isManuallySelected, locationCoords]);

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
            setLocationCoords(LOCATION_COORDINATES[storedLoc] ?? null);
        } else {
            setLocationState(LOCATIONS[0]);
            setIsManuallySelected(false);
            setLocationCoords(LOCATION_COORDINATES[LOCATIONS[0]] ?? null);
        }

        setZoneIdState(storedZoneId);
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const loadCart = async () => {
            try {
                const response = await cartApi.get(accessToken, zoneId);
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
        // Picking a location from the dropdown has no GPS fix of its own —
        // fall back to its hardcoded coordinates so the catalog can still
        // be loaded for that region (see the locationCoords effect in
        // page.tsx). Unrecognized location strings (e.g. Coming Soon areas)
        // simply clear it.
        setLocationCoords(LOCATION_COORDINATES[loc] ?? null);
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

    // The coordinates actually used to resolve a service zone: a manually
    // picked location's hardcoded coordinates (see setLocation above) take
    // priority over the device's GPS fix.
    const activeCoords = isManuallySelected && locationCoords ? locationCoords : gpsCoords;

    const zonesQuery = useZones(activeCoords?.lat ?? null, activeCoords?.lon ?? null, {
        enabled: isHydrated,
    });

    // Keeps `zoneId` (the ambient browsing zone the home/detail catalog
    // fetches for) in sync with whichever coordinates are currently active.
    // Only reacts to the zones query's own result changing — so it won't
    // clobber a zoneId set by updateCartAddress below (picking an address
    // in a different zone) unless the user also changes location/GPS.
    useEffect(() => {
        if (zonesQuery.isSuccess) {
            const zone = zonesQuery.data;
            setZoneId(zone?.exists && zone?.zoneId ? zone.zoneId : null);
        } else if (zonesQuery.isError) {
            setZoneId(null);
        }
    }, [zonesQuery.isSuccess, zonesQuery.isError, zonesQuery.data, setZoneId]);

    const zoneExists = zoneId !== null;
    const isZoneLoading =
        !isHydrated || (!activeCoords && !geolocationUnavailable) || zonesQuery.isLoading;
    const zoneError: Error | null =
        !isManuallySelected && geolocationUnavailable
            ? new Error("Location permission is required.")
            : ((zonesQuery.error as Error | null) ?? null);

    const syncCart = async (
        items: CartItem[],
        selectedAddressId = addressId,
        details: Partial<Pick<import("@/src/services/cartApi").UpdateCartBody, "scheduledDate" | "scheduledTime" | "isOnDemand" | "couponCode">> = {},
        propagateZoneToAmbient = false,
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
            }, accessToken, zoneId);
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
                // Only when this sync was triggered by an explicit address
                // change (see updateCartAddress) — not on every quantity
                // bump/slot pick — also point the ambient browsing zone at
                // wherever the newly selected address actually is, so the
                // home/detail catalog (keyed by zoneId) refetches for it.
                if (propagateZoneToAmbient && response.data.zoneId) {
                    setZoneId(response.data.zoneId);
                }
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
        void cartApi.deleteItem(id, accessToken, zoneId).catch((error) => {
            // Local removal stands either way, but log this — a failed
            // delete here means the item comes back on the next cart load.
            console.error("Failed to delete cart item", id, error);
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

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;
        void cartApi.clearItems(accessToken, zoneId).catch((error) => {
            // Local clear stands either way, but log this — a failed clear
            // here means the items come back on the next cart load.
            console.error("Failed to clear cart items", error);
        });
    };

    const updateItemSlot = (id: string, slotDate: string, slotStartTime: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, slotDate, slotStartTime } : item,
            ),
        );

        // Booking creation reads the cart-level scheduledDate/scheduledTime,
        // not this item's slotDate/slotStartTime — checkout never sends its
        // own scheduledDate, so the backend falls back to cart.scheduledDate
        // (see BookingService.create) and 400s "scheduledDate is required"
        // if that's still empty. Keep it in sync with whichever slot was
        // picked most recently so picking a slot here actually unblocks
        // checkout, instead of also requiring the separate on-demand
        // date/time fields to be filled in.
        updateCartSchedule({
            scheduledDate: slotDate,
            scheduledTime: slotStartTime,
            isOnDemand: false,
        });

        const item = cartItems.find((i) => i.id === id);
        const accessToken = localStorage.getItem("accessToken");
        if (!item || !item.serviceItemId || !item.durationId || !item.packageId || !accessToken)
            return;
        if (isPendingSync(item)) {
            // The UI (CartView's "Select time slot" button) is supposed to
            // stay disabled until this item has a real id — this is a
            // belt-and-suspenders check in case it's called some other way.
            // Sending the composite placeholder as {itemId} would 404.
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
                zoneId,
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
        void syncCart(cartItems, nextAddressId, {}, true);
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

    // Show unavailable if geolocation was explicitly denied/unavailable and
    // the user hasn't manually selected a location yet.
    const isLocationSupported = isManuallySelected || !geolocationUnavailable;

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
                locationCoords,
                isLocationManuallySelected: isManuallySelected,
                isHydrated,
                zoneId,
                setZoneId,
                zoneExists,
                isZoneLoading,
                zoneError,
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

