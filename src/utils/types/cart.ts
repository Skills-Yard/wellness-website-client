export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  duration: string;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;   // 👈 ye line add karo
  decreaseQuantity: (id: string) => void;   // 👈 ye line add karo
  clearCart: () => void;
  location: string;
  setLocation: (loc: string) => void;
  isLocationSupported: boolean;
}