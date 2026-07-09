export type BookingStep = "cart" | "confirmation" | "tracking";

export interface BookingDetails {
  id: string;
  dateTime: string;
  address: string;
}