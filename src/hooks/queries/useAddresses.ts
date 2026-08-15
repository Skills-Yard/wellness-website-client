"use client";

import { useQuery } from "@tanstack/react-query";
import { addressApi, getAddressList } from "@/src/services/addressApi";
import { queryKeys } from "./queryKeys";

/** Saved delivery addresses for the logged-in user. Disabled entirely (no
 *  request fires) when there's no accessToken — every location picker
 *  that surfaces saved addresses stays exactly as it was for logged-out
 *  users. */
export function useAddresses() {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return useQuery({
    queryKey: queryKeys.addresses(),
    queryFn: () => addressApi.get(accessToken as string).then((r) => getAddressList(r.data)),
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000,
  });
}
