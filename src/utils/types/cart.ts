export interface CartItem {
    id: string;
    title: string;
    price: number;
    duration: string;
    image: string;
    quantity: number;
}

export interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    
    // Location Guard State
    location: string;
    setLocation: (loc: string) => void;
    isLocationSupported: boolean;
}
