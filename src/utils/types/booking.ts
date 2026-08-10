import type { CartItem } from "./cart";

export type BookingStep = "cart" | "confirmation" | "tracking";

export interface BookingDetails {
  id: string;
  dateTime: string;
  address: string;
  items: CartItem[];
}
