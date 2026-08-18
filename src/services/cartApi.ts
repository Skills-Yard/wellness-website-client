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
  serviceItem?: {
    title?: string;
    name?: string;
    image?: string;
    media?: string;
    price?: number | string;
    thumbnailKey?: string | null;
  };
  duration?: {
    label?: string;
    name?: string;
    title?: string;
    duration?: string;
    durationMinutes?: number;
    price?: number | string;
    discountedPrice?: number | string | null;
  };
  package?: {
    label?: string;
    name?: string;
    price?: number | string;
    sessions?: number;
    pricePerSession?: number | string;
  };
  addOns?: { name?: string; price?: number | string; extraMinutes?: number }[];
  // Attached server-side (see CartService.attachPricing) from the cart's
  // current zoneId — the zone/duration/surge-adjusted per-unit price,
  // add-ons already folded in. Prefer this over serviceItem/package.price
  // when reading a display price; those are the raw, zone-blind base rates.
  unitPrice?: number | null;
  totalPrice?: number | null;
  addOnsTotal?: number;
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
  // See the matching fields on CartApiItem above — client-computed, sent
  // so the backend doesn't fall back to storing/returning 0 for them.
  unitPrice?: number;
  totalPrice?: number;
  addOnsTotal?: number;
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

// The client's currently browsed/selected zone, sent as x-zone-id so the
// backend pins the cart to it (see CartService.updateCart) instead of
// falling back to a saved default address / IP geolocation / global
// default — none of which reflect what the user actually has selected.
// Same rationale as categoryApi.ts's zoneHeaders.
const zoneHeaders = (zoneId?: string | null) =>
  zoneId ? { headers: { "x-zone-id": zoneId } } : undefined;

export const cartApi = {
  get(accessToken: string, zoneId?: string | null) {
    return apiClient.get<CartResponse>("/cart", { accessToken, ...zoneHeaders(zoneId) });
  },
  // Cart-wide fields only (address/schedule/coupon) — item quantities/slots
  // go through updateItem below instead, which targets one real item id.
  update(body: UpdateCartBody, accessToken: string, zoneId?: string | null) {
    return apiClient.patch<UpdateCartBody, CartResponse>("/cart", body, {
      accessToken,
      ...zoneHeaders(zoneId),
    });
  },
  updateItem(itemId: string, body: CartItemUpdateBody, accessToken: string, zoneId?: string | null) {
    return apiClient.patch<CartItemUpdateBody, CartResponse>(
      `/cart/items/${itemId}`,
      body,
      { accessToken, ...zoneHeaders(zoneId) },
    );
  },
  deleteItem(itemId: string, accessToken: string, zoneId?: string | null) {
    return apiClient.delete<CartResponse>(`/cart/items/${itemId}`, {
      accessToken,
      ...zoneHeaders(zoneId),
    });
  },
  clearItems(accessToken: string, zoneId?: string | null) {
    return apiClient.delete<CartResponse>("/cart", { accessToken, ...zoneHeaders(zoneId) });
  },
};




