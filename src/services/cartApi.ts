import { apiClient } from "@/src/lib/api/apiClient";
import type { ApiSuccess } from "@/src/types/auth";

export type CartApiItem = {
  serviceItemId: string;
  durationId: string;
  packageId: string;
  addOnIds: string[];
  quantity: number;
  id?: string;
  // Per-item slot, set via cartApi.updateItem — distinct from the cart-wide
  // scheduledDate/scheduledTime below (see CartData), which is what
  // "on-demand" / no-slot-picked bookings fall back to.
  slotDate?: string;
  slotStartTime?: string;
  // `image`/`media`/`price` don't actually exist on the Prisma ServiceItem
  // model (it only has thumbnailKey — a raw, unresolved storage key — and
  // carries no price of its own; price lives on duration/package). Kept
  // here only as historical dead fallbacks; see toCartItem in CartContext.
  serviceItem?: { title?: string; name?: string; image?: string; media?: string; thumbnailKey?: string; price?: number | string };
  duration?: { label?: string; name?: string; title?: string; duration?: string; durationMinutes?: number; price?: number; discountedPrice?: number | null };
  package?: { label?: string; name?: string; price?: number | string; sessions?: number; pricePerSession?: number | string };
  addOns?: { name?: string; price?: number | string; extraMinutes?: number }[];
  // Attached server-side by CartService.attachPricing, computed fresh from
  // the cart's zone on every read — this is the one authoritative per-unit
  // price (package/duration price plus every selected add-on's price), and
  // should be preferred over deriving price from package/duration alone
  // (see toCartItem in CartContext), which silently drops add-ons.
  unitPrice?: number | null;
  totalPrice?: number | null;
  addOnsTotal?: number | null;
};

// Body for PATCH /cart/items/{itemId} — a full item representation (not a
// partial patch), matching what the backend expects even though the verb
// is PATCH.
export type CartItemUpdateBody = {
  serviceItemId: string;
  durationId: string;
  packageId: string;
  addOnIds: string[];
  quantity: number;
  slotDate?: string;
  slotStartTime?: string;
};

export type UpdateCartBody = {
  items: CartApiItem[];
  addressId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  isOnDemand?: boolean;
  couponCode?: string;
};
export type CartData = {
  id?: string;
  cartId?: string;
  addressId?: string;
  // The zone the cart is actually pinned to server-side — follows the
  // selected address's zone once one is picked (see updateCart on the
  // backend), which can differ from the ambient browsing zoneId in
  // CartContext. Slot reservation checks partner capacity against this
  // zone, so slot discovery must use it too (see cartZoneId in
  // CartContext) rather than the browsing zoneId.
  zoneId?: string | null;
  scheduledDate?: string;
  scheduledTime?: string;
  isOnDemand?: boolean;
  couponCode?: string;
  items: CartApiItem[];
};
export type CartResponse = ApiSuccess<CartData>;

export const cartApi = {
  get(accessToken: string) {
    return apiClient.get<CartResponse>("/cart", { accessToken });
  },
  // Cart-wide fields only (address/schedule/coupon) — item quantities/slots
  // go through updateItem below instead, which targets one real item id.
  update(body: UpdateCartBody, accessToken: string) {
    return apiClient.patch<UpdateCartBody, CartResponse>("/cart", body, { accessToken });
  },
  updateItem(itemId: string, body: CartItemUpdateBody, accessToken: string) {
    return apiClient.patch<CartItemUpdateBody, CartResponse>(
      `/cart/items/${itemId}`,
      body,
      { accessToken },
    );
  },
  deleteItem(itemId: string, accessToken: string) {
    return apiClient.delete<CartResponse>(`/cart/items/${itemId}`, { accessToken });
  },
  clearItems(accessToken: string) {
    return apiClient.delete<CartResponse>("/cart", { accessToken });
  },
};
