export interface CartItem {
  id: string;
  title: string;
  /** Per-unit price — the selected duration × package pricing plus every
   *  selected add-on's price (see getCartItemPricing in utils/pricing.ts).
   *  What's sent to the backend as a cart write's `unitPrice`. */
  price: number;
  /** Per-unit portion of `price` contributed by selected add-ons — broken
   *  out separately (rather than re-derived) because the flattened
   *  CartItem shape has no raw add-on catalog to recompute it from once a
   *  cart row is loaded from local storage. Sent as `addOnsTotal`. */
  addOnsTotal?: number;
  image: string;
  duration: string;
  quantity: number;
  serviceItemId?: string;
  durationId?: string;
  packageId?: string;
  addOnIds?: string[];
  /** Per-item booking slot — independent of the cart-wide scheduledDate/
   *  scheduledTime below, since each service can be booked for a different
   *  time. Set via updateItemSlot / the slot-picker popup. */
  slotDate?: string;
  slotStartTime?: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;   // 👈 ye line add karo
  decreaseQuantity: (id: string) => void;   // 👈 ye line add karo
  clearCart: () => void;
  location: string;
  setLocation: (loc: string) => void;
  isLocationSupported: boolean;
  /** Hardcoded lat/lon for the current `location` (see
   *  utils/data/coordinates.ts), null when it isn't a recognized dropdown
   *  entry. Lets a manual dropdown pick substitute for the device's GPS
   *  position when loading the catalog. */
  locationCoords: { lat: number; lon: number } | null;
  /** True once the user has explicitly picked a location (dropdown or the
   *  "Select Your Area" grid) rather than it coming from geolocation or the
   *  default. */
  isLocationManuallySelected: boolean;
  /** True once CartContext has finished reading localStorage (cart, location,
   *  zone) on mount. Callers that decide whether to prompt for geolocation
   *  or show a "pick your location" UI should wait for this first — acting
   *  on `isLocationManuallySelected`/`locationCoords` before it flips means
   *  reading their still-default, pre-hydration values and prompting even
   *  when a location was already saved. */
  isHydrated: boolean;
  zoneId: string | null;
  setZoneId: (zoneId: string | null) => void;
  /** True once `zoneId` has resolved to a real, servable zone — derived
   *  from `zoneId !== null`. Centralized zone resolution (geolocation or a
   *  manually picked location, see CartProvider) is what sets `zoneId`. */
  zoneExists: boolean;
  /** True while zone resolution is still in flight — waiting on GPS,
   *  waiting on the zones API, or both. */
  isZoneLoading: boolean;
  /** Set when geolocation was denied/unavailable (and nothing was manually
   *  picked) or the zones API call itself failed. Null when resolution
   *  succeeded or is still in progress. */
  zoneError: Error | null;
  /** The zone the server-side cart is actually pinned to (follows the
   *  selected delivery address once one is picked) — distinct from `zoneId`
   *  above, which is the ambient browsing/geolocation zone. Slot discovery
   *  must use this one so it matches the zone reservation checks capacity
   *  against. Null until the cart has synced with the server at least once. */
  cartZoneId: string | null;
  cartId: string | null;
  addressId: string | null;
  updateCartAddress: (addressId: string) => void;
  scheduledDate: string;
  scheduledTime: string;
  isOnDemand: boolean;
  couponCode: string;
  updateCartSchedule: (details: { scheduledDate?: string; scheduledTime?: string; isOnDemand?: boolean; couponCode?: string }) => void;
  /** Resolves once the slot update has settled (server round-trip done,
   *  or immediately for the no-op paths) — the slot-picker modal awaits
   *  this to keep its "Updating…" state up and close itself on success. */
  updateItemSlot: (id: string, slotDate: string, slotStartTime: string) => Promise<void>;
  /** True while this cart item's slot update (PATCH /cart/items/{itemId})
   *  is in flight — the local slot picked via updateItemSlot is already
   *  applied optimistically, but callers can use this to show a loading
   *  state until the server has actually confirmed it. */
  isUpdatingSlot: (id: string) => boolean;
  /** True while any cart-mutating request is in flight — the bulk PATCH
   *  /cart sync, or a per-item delete/update/clear call. Every public cart
   *  mutator (addToCart, removeFromCart, updateQuantity, clearCart,
   *  updateItemSlot, updateCartAddress, updateCartSchedule) already drops
   *  a call made while this is true rather than racing it; callers should
   *  still disable their own controls and show a busy state while it's set
   *  instead of relying solely on that silent drop. */
  isCartSyncing: boolean;
  /** True while the authoritative GET /cart hydration is in flight — the
   *  initial mount load, or a re-hydrate right after login. The cart
   *  drawer should show a loading state rather than its empty-cart screen
   *  while this is set, so it doesn't flash "your cart is empty" before
   *  the real items have arrived from the server. */
  isCartHydrating: boolean;
}
