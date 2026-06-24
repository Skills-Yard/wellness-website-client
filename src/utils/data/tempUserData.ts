export interface Address {
  id: string;
  type: "Home" | "Work" | "Other";
  fullAddress: string;
}

export interface UserProfile {
  phone: string;
  name: string;
  email: string;
  addresses: Address[];
}

export const tempUser: UserProfile = {
  phone: "+91 98765 43210",
  name: "",  // Empty to simulate incomplete profile via OTP login
  email: "",
  addresses: [
    {
      id: "addr-1",
      type: "Home",
      fullAddress: "123, Palm Grove Apartments, Andheri West, Mumbai, 400053",
    }
  ],
};