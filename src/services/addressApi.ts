import { apiClient } from "@/src/lib/api/apiClient";
import type { ApiSuccess } from "@/src/types/auth";

export type Address = {
  id: string;
  userId?: string;
  label?: string;
  customLabel?: string;
  line1?: string;
  line2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
};

export type CreateAddressBody = {
  userId: string;
  label: string;
  customLabel: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
};

export type UpdateAddressBody = Omit<CreateAddressBody, "userId">;

export type AddressesResponse = ApiSuccess<
  Address[] | { addresses?: Address[]; items?: Address[] }
>;
export type CreateAddressResponse = ApiSuccess<Address>;
export type UpdateAddressResponse = ApiSuccess<Address>;
export type RemoveAddressResponse = ApiSuccess<Address>;

/** GET /users/addresses' `data` comes back either as a bare array or
 *  wrapped in { addresses } / { items } depending on endpoint version —
 *  normalizes both shapes into a plain array. Shared by every caller that
 *  lists addresses (CartSheet, useAddresses, the location pickers) so
 *  there's one place that knows about the shape quirk. */
export const getAddressList = (data: AddressesResponse["data"]): Address[] =>
  Array.isArray(data) ? data : (data.addresses ?? data.items ?? []);

/** Single-line, comma-joined address for display in pickers/labels. */
export const formatAddressLabel = (address: Address) =>
  [address.line1, address.line2, address.landmark, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");

export const addressApi = {
  get(accessToken: string) {
    return apiClient.get<AddressesResponse>("/users/addresses", {
      accessToken,
    });
  },
  create(body: CreateAddressBody, accessToken: string) {
    return apiClient.post<CreateAddressBody, CreateAddressResponse>(
      "/users/addresses",
      body,
      { accessToken },
    );
  },
  // Verb assumed as PATCH to match the sibling /cart/items/{id} update
  // endpoint's convention — flag it if the backend actually expects PUT.
  update(addressId: string, body: UpdateAddressBody, accessToken: string) {
    return apiClient.patch<UpdateAddressBody, UpdateAddressResponse>(
      `/users/addresses/${addressId}`,
      body,
      { accessToken },
    );
  },
  remove(addressId: string, accessToken: string) {
    return apiClient.delete<RemoveAddressResponse>(
      `/users/addresses/${addressId}`,
      { accessToken },
    );
  },
};
