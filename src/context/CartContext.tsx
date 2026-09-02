"use client";

import { LOCATIONS, LOCATION_COORDINATES } from "@/src/utils/data";
import { CartItem, CartContextType } from "@/src/utils/types";
import { cartApi, type CartApiItem } from "@/src/services/cartApi";
import { getCartItemPricing } from "@/src/utils/pricing";
import { useZones } from "@/src/hooks/queries/useZones";
import { hasValidAccessToken } from "@/src/utils/auth/token";
import { refreshAccessToken } from "@/src/lib/api/apiClient";
import { AUTH_CHANGED_EVENT } from "@/src/utils/auth/authEvents";
import LazyAuthModal from "@/src/components/auth/LazyAuthModal";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

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
export const isPendingSync = (item: CartItem) =>
  item.id === buildLocalCartItemId(item);

// `next/image` throws if `src` isn't an absolute URL or a root-relative
// path. The cart API's nested `serviceItem` is a raw Prisma read (see
// syncCart/updateItemSlot below) with no CDN-resolution step applied — it
// only ever carries `thumbnailKey`, an unresolved storage key like
// "services/udwarthanam/thumbnails/xyz_v1.jpg", not a usable URL. Same
// situation as the booking payload's serviceItem.thumbnailKey (see
// resolveImageSrc in components/bookings/bookingStatus.ts); duplicated
// here rather than imported, since a feature component isn't a sensible
// dependency for this context to carry.
const resolveCartItemImage = (key?: string | null): string | null =>
    key && (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/"))
        ? key
        : null;

const toCartItem = (item: CartApiItem): CartItem => ({
    id: item.id ?? buildLocalCartItemId(item),
    serviceItemId: item.serviceItemId,
    durationId: item.durationId,
    packageId: item.packageId,
    addOnIds: item.addOnIds ?? [],
    quantity: item.quantity,
    title:
      item.serviceItem?.title ?? item.serviceItem?.name ?? "Selected service",
    image:
        resolveCartItemImage(
            item.serviceItem?.image ?? item.serviceItem?.media ?? item.serviceItem?.thumbnailKey,
        ) ?? "/images/hero-fallback.jpg",
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
  const [gpsCoords, setGpsCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [geolocationUnavailable, setGeolocationUnavailable] = useState(false);
  const [isManuallySelected, setIsManuallySelected] = useState(false);
  // Hardcoded lat/lon for whichever location is currently selected (see
  // LOCATION_COORDINATES) — lets a dropdown pick stand in for the
  // device's GPS position when feeding getZones().
  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
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
  // Cart row ids whose PATCH /cart/items/{itemId} slot update is currently
  // in flight — lets CartView show a loading state on that item's "Select
  // time slot" button until the request actually settles, rather than
  // relying solely on the optimistic local update below.
  const [updatingSlotItemIds, setUpdatingSlotItemIds] = useState<Set<string>>(
    new Set(),
  );
  // The item addToCart was asked to add while there was no valid session —
  // held here so the login modal below can add it for real once
  // authentication actually completes, instead of the click just being lost.
  const [pendingCartItem, setPendingCartItem] = useState<Omit<
    CartItem,
    "quantity"
  > | null>(null);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  // Counts cart-mutating requests currently in flight (bulk PATCH /cart via
  // syncCart, plus the per-item delete/update/clear calls that bypass it) —
  // a counter rather than a plain boolean since e.g. a quantity bump and a
  // slot pick can overlap, and the lock must stay on until the *last* one
  // settles, not whichever settles first. `isCartSyncing` (derived below)
  // is what callers actually read; every public cart mutator also checks it
  // before starting a new one, so a second edit fired while the first is
  // still in flight is dropped instead of racing it — the exact
  // "PATCH /cart still in flight when Checkout reads a stale zone" class of
  // bug CartSheet's handleCheckout otherwise has to work around after the
  // fact. CartView reads it too, to disable its controls and show a busy
  // state instead of just silently swallowing the click.
  const [syncingCount, setSyncingCount] = useState(0);
  const isCartSyncing = syncingCount > 0;
  // Synchronous mirror of syncingCount — a mutation's beginSync() bumps
  // this in the same tick, before React re-renders. loadCart() reads it
  // right after its GET resolves to tell whether a mutation started while
  // that GET was in flight (in which case the mutation's PATCH response is
  // the fresher truth and this GET must not clobber it — see loadCart).
  const syncInFlightRef = useRef(0);
  const beginSync = useCallback(() => {
    syncInFlightRef.current += 1;
    setSyncingCount((count) => count + 1);
  }, []);
  const endSync = useCallback(() => {
    syncInFlightRef.current = Math.max(0, syncInFlightRef.current - 1);
    setSyncingCount((count) => Math.max(0, count - 1));
  }, []);
  // True while the authoritative GET /cart hydration is in flight (mount,
  // or a re-hydrate after login). Lets the cart drawer show a loading
  // state instead of flashing its empty-cart screen before the real items
  // have arrived. Starts true when there's already a session to load a
  // cart for, so the first paint is the loader, not "your cart is empty".
  const [isCartHydrating, setIsCartHydrating] = useState(
    () => typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
  );

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
        setGpsCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
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

    const storedCart = localStorage.getItem("eezit_cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }

    const storedLoc = localStorage.getItem("eezit_location");
    const storedZoneId = localStorage.getItem("eezit_zone_id");
    const storedManual = localStorage.getItem("eezit_manual_location");

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
    // Pulls the authoritative cart from the server and replaces local
    // state with it — the same hydration a full page reload does. No-ops
    // without an access token.
    const loadCart = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsCartHydrating(false);
        return;
      }

      setIsCartHydrating(true);
      try {
        // Read the zone straight from storage, not the zoneId state
        // variable — on the mount call this runs before the sibling
        // localStorage-hydration effect's setState is visible here, but
        // the raw value is already on disk.
        const response = await cartApi.get(
          accessToken,
          localStorage.getItem("eezit_zone_id"),
        );
        // A cart mutation (add / quantity / slot / address) fired while
        // this GET was in flight — e.g. the post-login "add the item they
        // clicked before logging in" flow, which runs a PATCH /cart in
        // the same tick this re-hydrate was triggered. That PATCH's
        // response is the fresher truth; letting this now-stale GET write
        // is exactly what made the drawer blink to "empty" for a beat.
        if (syncInFlightRef.current > 0) return;
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
      } finally {
        setIsCartHydrating(false);
      }
    };

    void loadCart();
    // Re-hydrate whenever login/logout happens anywhere in the tab. A
    // mid-session login (the cart's own inline auth prompt, the navbar, or
    // a silent token refresh) used to leave this context stuck on its
    // pre-login state — an empty/local cart, a "please log in" address
    // error — until the page was reloaded.
    const onAuthChanged = () => void loadCart();
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
  }, []);

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem("eezit_cart", JSON.stringify(cartItems));
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
      localStorage.setItem("eezit_location", loc);
      localStorage.setItem("eezit_manual_location", "true");
    }
  }, []);

  const setZoneId = useCallback((id: string | null) => {
    setZoneIdState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem("eezit_zone_id", id);
      else localStorage.removeItem("eezit_zone_id");
    }
  }, []);

  // The coordinates actually used to resolve a service zone: a manually
  // picked location's hardcoded coordinates (see setLocation above) take
  // priority over the device's GPS fix.
  const activeCoords =
    isManuallySelected && locationCoords ? locationCoords : gpsCoords;

  const zonesQuery = useZones(
    activeCoords?.lat ?? null,
    activeCoords?.lon ?? null,
    {
      enabled: isHydrated,
    },
  );

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
    !isHydrated ||
    (!activeCoords && !geolocationUnavailable) ||
    zonesQuery.isLoading;
  const zoneError: Error | null =
    !isManuallySelected && geolocationUnavailable
      ? new Error("Location permission is required.")
      : ((zonesQuery.error as Error | null) ?? null);

  const syncCart = async (
    items: CartItem[],
    selectedAddressId = addressId,
    details: Partial<
      Pick<
        import("@/src/services/cartApi").UpdateCartBody,
        "scheduledDate" | "scheduledTime" | "isOnDemand" | "couponCode"
      >
    > = {},
    propagateZoneToAmbient = false,
  ) => {
    const accessToken = localStorage.getItem("accessToken");
    // Deliberately no slotDate/slotStartTime here — the backend 400s
    // ("Slot selection is not supported on this endpoint") if a bulk
    // PATCH /cart item carries either. Per-item slot data only ever
    // goes through PATCH /cart/items/{itemId} (see updateItemSlot /
    // updateQuantity below), so this bulk sync must never touch it —
    // any slot a per-item call already set on the server is left alone
    // simply by this payload staying silent about it.
    const apiItems: CartApiItem[] = items.flatMap((item) =>
      item.serviceItemId && item.durationId && item.packageId
        ? [
            {
              serviceItemId: item.serviceItemId,
              durationId: item.durationId,
              packageId: item.packageId,
              addOnIds: item.addOnIds ?? [],
              quantity: item.quantity,
              // Client-computed (see getCartItemPricing in utils/pricing.ts)
              // — GET /cart always reports these as 0 itself, so leaving
              // them off here would keep pushing 0 back to the server on
              // every sync.
              unitPrice: item.price,
              addOnsTotal: item.addOnsTotal ?? 0,
              totalPrice: item.price * item.quantity,
            },
          ]
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

    beginSync();
    try {
      const response = await cartApi.update(
        {
          items: apiItems,
          ...(selectedAddressId ? { addressId: selectedAddressId } : {}),
          ...(resolvedScheduledDate
            ? { scheduledDate: resolvedScheduledDate }
            : {}),
          ...(resolvedScheduledTime
            ? { scheduledTime: resolvedScheduledTime }
            : {}),
          isOnDemand: details.isOnDemand ?? isOnDemand,
          ...(resolvedCouponCode ? { couponCode: resolvedCouponCode } : {}),
        },
        accessToken,
        cartZoneId ?? zoneId,
      );
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
    } finally {
      endSync();
    }
  };

  const performAddToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const next = existing
        ? prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...prev, { ...item, quantity: 1 }];
      void syncCart(next);
      return next;
    });
    setIsCartOpen(true);
  };

  // Every cart mutation syncs straight to the server (see syncCart above),
  // which silently no-ops without an access token — so adding to cart
  // while logged out (or with an expired token) would otherwise look like
  // it worked locally and then quietly vanish on the next load/sync.
  // Gate on a present *and* unexpired token instead, and prompt login;
  // the item is added for real once that login actually completes (see
  // the LazyAuthModal below).
  //
  // Also dropped outright while another cart mutation is still syncing
  // (isCartSyncing) — two edits in flight at once is exactly what lets the
  // cart end up inconsistent (e.g. Checkout reading a zone the previous
  // edit hasn't finished writing yet). The UI disables its buttons for the
  // same reason; this is the backstop for whatever slips past that.
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    if (isCartSyncing) return;
    if (hasValidAccessToken()) {
      performAddToCart(item);
      return;
    }
    // No usable access token. If it's merely expired and a refresh token
    // is still on hand, renew it silently and add the item — don't make
    // the user sit through a full OTP login again just because the access
    // token aged out. refreshAccessToken() resolves to null (and clears
    // the local session) when there's genuinely nothing to resume, which
    // is the only case that still needs the login prompt.
    void refreshAccessToken().then((token) => {
      if (token) {
        performAddToCart(item);
      } else {
        setPendingCartItem(item);
        setIsAuthPromptOpen(true);
      }
    });
  };

  const removeFromCart = (id: string) => {
    if (isCartSyncing) return;
    const item = cartItems.find((i) => i.id === id);
    setCartItems((prev) => prev.filter((i) => i.id !== id));

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    if (!item || isPendingSync(item)) {
      // Nothing to delete server-side yet — the add hasn't synced (or
      // is still in flight), so this item was never created in the
      // cart the server knows about. Local removal above covers it.
      console.warn(
        "Skipped cart item delete — item hasn't synced with the server yet",
        id,
      );
      return;
    }
    if (!item.serviceItemId) {
      console.warn("Skipped cart item delete — item has no serviceItemId", id);
      return;
    }
    // Real delete, not the bulk PATCH /cart other mutations use here —
    // that only ever sent the trimmed items array along for the ride,
    // which silently did nothing to remove anything server-side.
    // DELETE /cart/items/{itemId} — {itemId} is the service's own id
    // (serviceItemId), not this cart row's own `id` field.
    beginSync();
    void cartApi
      .deleteItem(item.id, accessToken, cartZoneId ?? zoneId)
      .catch((error) => {
        // Local removal stands either way, but log this — a failed
        // delete here means the item comes back on the next cart load.
        console.error("Failed to delete cart item", id, error);
      })
      .finally(endSync);
  };

  // Shared by increase/decreaseQuantity below. Targets this one item via
  // PATCH /cart/items/{itemId} (cartApi.updateItem) instead of the bulk
  // PATCH /cart syncCart uses — a quantity bump doesn't need to touch
  // every other item in the cart. Reads cartItems directly (not a
  // functional setCartItems update) for the same reason updateItemSlot
  // does: this needs the current item's slotDate/slotStartTime to carry
  // along, and a functional updater's callback can't see that.
  const updateQuantity = (id: string, nextQuantity: number) => {
    if (isCartSyncing) return;
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: nextQuantity } : item,
    );
    setCartItems(updatedItems);

    const item = updatedItems.find((i) => i.id === id);
    const accessToken = localStorage.getItem("accessToken");
    if (!item || !accessToken) return;

    if (
      isPendingSync(item) ||
      !item.serviceItemId ||
      !item.durationId ||
      !item.packageId
    ) {
      // No real backend id yet for /cart/items/{id} to target — falls
      // back to the bulk sync (same call addToCart makes) so this
      // quantity still reaches the server once the item itself syncs.
      void syncCart(updatedItems);
      return;
    }

    beginSync();
    cartApi
      .updateItem(
        // {itemId} in PATCH /cart/items/{itemId} is this cart row's own
        // `id` field, same as updateItemSlot below — serviceItemId (a
        // different id, the service being purchased) only ever belongs
        // in the body.
        item.id,
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
          // Client-computed (see getCartItemPricing) — resent on every
          // write since GET /cart always reports these as 0 itself.
          // item.price is per-unit, so totalPrice scales with the new
          // quantity rather than the old one.
          unitPrice: item.price,
          addOnsTotal: item.addOnsTotal ?? 0,
          totalPrice: item.price * nextQuantity,
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
      })
      .finally(endSync);
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
    if (isCartSyncing) return;
    setCartItems([]);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    beginSync();
    void cartApi
      .clearItems(accessToken, cartZoneId ?? zoneId)
      .catch((error) => {
        // Local clear stands either way, but log this — a failed clear
        // here means the items come back on the next cart load.
        console.error("Failed to clear cart items", error);
      })
      .finally(endSync);
  };

  const updateItemSlot = (
    id: string,
    slotDate: string,
    slotStartTime: string,
  ): Promise<void> => {
    if (isCartSyncing) return Promise.resolve();
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
    if (
      !item ||
      !item.serviceItemId ||
      !item.durationId ||
      !item.packageId ||
      !accessToken
    )
      return Promise.resolve();
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
      return Promise.resolve();
    }

    // Marks this cart row as "saving" so CartView can show a loading
    // state on its slot button until the request below settles —
    // cleared in .finally() regardless of outcome. The returned promise
    // lets the slot-picker modal stay open with its own "Updating…"
    // state and close only once this settles.
    setUpdatingSlotItemIds((prev) => new Set(prev).add(id));
    beginSync();

    return cartApi
      .updateItem(
        // {itemId} in PATCH /cart/items/{itemId} is the service's
        // own id (serviceItemId) — the id of the service this cart
        // item was added for — not this cart row's own `id` field.
        item.id,
        {
          serviceItemId: item.serviceItemId,
          durationId: item.durationId,
          packageId: item.packageId,
          addOnIds: item.addOnIds ?? [],
          quantity: item.quantity,
          slotDate,
          slotStartTime,
          // Client-computed (see getCartItemPricing) — resent on every
          // write since GET /cart always reports these as 0 itself.
          unitPrice: item.price,
          addOnsTotal: item.addOnsTotal ?? 0,
          totalPrice: item.price * item.quantity,
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
      })
      .finally(() => {
        setUpdatingSlotItemIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        endSync();
      });
  };

  const isUpdatingSlot = useCallback(
    (id: string) => updatingSlotItemIds.has(id),
    [updatingSlotItemIds],
  );

  const updateCartAddress = (nextAddressId: string) => {
    if (isCartSyncing) return;
    setAddressId(nextAddressId);
    void syncCart(cartItems, nextAddressId, {}, true);
  };

  const updateCartSchedule = (details: {
    scheduledDate?: string;
    scheduledTime?: string;
    isOnDemand?: boolean;
    couponCode?: string;
  }) => {
    if (isCartSyncing) return;
    if (details.scheduledDate !== undefined)
      setScheduledDate(details.scheduledDate);
    if (details.scheduledTime !== undefined)
      setScheduledTime(details.scheduledTime);
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
        isUpdatingSlot,
        isCartSyncing,
        isCartHydrating,
      }}
    >
      {children}
      {isAuthPromptOpen && (
        <LazyAuthModal
          onClose={() => {
            setIsAuthPromptOpen(false);
            setPendingCartItem(null);
          }}
          onComplete={() => {
            setIsAuthPromptOpen(false);
            if (pendingCartItem) performAddToCart(pendingCartItem);
            setPendingCartItem(null);
          }}
          // The visitor was mid-add-to-cart, not intentionally navigating to
          // their profile — land them back where they were (with the item
          // now actually in the cart) instead of on /profile.
          redirectToProfile={false}
        />
      )}
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

