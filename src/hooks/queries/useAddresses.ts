"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressApi, getAddressList } from "@/src/services/addressApi";
import type { CreateAddressBody, UpdateAddressBody } from "@/src/services/addressApi";
import { queryKeys } from "./queryKeys";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

/** Saved delivery addresses for the logged-in user. Disabled entirely (no
 *  request fires) when there's no accessToken — every location picker
 *  that surfaces saved addresses stays exactly as it was for logged-out
 *  users. */
export function useAddresses() {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: queryKeys.addresses(),
    queryFn: () => addressApi.get(accessToken as string).then((r) => getAddressList(r.data)),
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateAddressBody) => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return addressApi.create(body, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses() });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, body }: { addressId: string; body: UpdateAddressBody }) => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return addressApi.update(addressId, body, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses() });
    },
  });
}

export function useRemoveAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Not logged in.");
      return addressApi.remove(addressId, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses() });
    },
  });
}
