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

// zoneId travels as the `x-zone-id` header on every call below, never as a
// body/query field — same convention as serviceItemApi/homeApi/paymentApi/
// campaignApi/bookingApi (see bookingApi.ts's getAvailableSlots for the full
// story). This module was the one holdout that never sent it at all: the
// backend couldn't resolve which zone to operate a cart write against, which
// is what actually caused a freshly-added item to never reconcile a real id
// (PATCH /cart would fail or come back without the item's zone-dependent
// fields) — the item then looked "stuck" until a page refresh's plain
// GET /cart (no zone needed just to read back what's already stored) pulled
// the real, already-persisted item down.
const zoneHeader = (zoneId?: string | null) =>
  zoneId ? { headers: { "x-zone-id": zoneId } } : {};

export const cartApi = {
  get(accessToken: string, zoneId?: string | null) {
    return apiClient.get<CartResponse>("/cart", {
      accessToken,
      ...zoneHeader(zoneId),
    });
  },
  // Cart-wide fields only (address/schedule/coupon) — item quantities/slots
  // go through updateItem below instead, which targets one real item id.
  update(body: UpdateCartBody, accessToken: string, zoneId?: string | null) {
    return apiClient.patch<UpdateCartBody, CartResponse>("/cart", body, {
      accessToken,
      ...zoneHeader(zoneId),
    });
  },
  updateItem(
    itemId: string,
    body: CartItemUpdateBody,
    accessToken: string,
    zoneId?: string | null,
  ) {
    return apiClient.patch<CartItemUpdateBody, CartResponse>(
      `/cart/items/${itemId}`,
      body,
      { accessToken, ...zoneHeader(zoneId) },
    );
  },
  deleteItem(itemId: string, accessToken: string, zoneId?: string | null) {
    return apiClient.delete<CartResponse>(`/cart/items/${itemId}`, {
      accessToken,
      ...zoneHeader(zoneId),
    });
  },
  clearItems(accessToken: string, zoneId?: string | null) {
    return apiClient.delete<CartResponse>("/cart", {
      accessToken,
      ...zoneHeader(zoneId),
    });
  },
};
