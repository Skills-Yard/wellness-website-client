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
  serviceItem?: { title?: string; name?: string; image?: string; media?: string; price?: number | string };
  duration?: { label?: string; name?: string; title?: string; duration?: string; durationMinutes?: number };
  package?: { label?: string; name?: string; price?: number | string; sessions?: number; pricePerSession?: number | string };
  addOns?: { name?: string; price?: number | string; extraMinutes?: number }[];
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
    return apiClient.delete<CartResponse>("/cart/items", { accessToken });
  },
};
