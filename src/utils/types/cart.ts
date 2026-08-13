export interface CartItem {
  id: string;
  title: string;
  price: number;
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
  zoneId: string | null;
  setZoneId: (zoneId: string | null) => void;
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
  updateItemSlot: (id: string, slotDate: string, slotStartTime: string) => void;
}
