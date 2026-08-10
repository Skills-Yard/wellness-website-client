import { apiClient } from "@/src/lib/api/apiClient";
import type { ApiSuccess } from "@/src/types/auth";

export type CartApiItem = {
  serviceItemId: string;
  durationId: string;
  packageId: string;
  addOnIds: string[];
  quantity: number;
  id?: string;
  serviceItem?: { title?: string; name?: string; image?: string; media?: string; price?: number | string };
  duration?: { label?: string; name?: string; title?: string; duration?: string; durationMinutes?: number };
  package?: { label?: string; name?: string; price?: number | string; sessions?: number; pricePerSession?: number | string };
  addOns?: { name?: string; price?: number | string; extraMinutes?: number }[];
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
  update(body: UpdateCartBody, accessToken: string) {
    return apiClient.patch<UpdateCartBody, CartResponse>("/cart", body, { accessToken });
  },
};
