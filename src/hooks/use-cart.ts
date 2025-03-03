import { createContext, useContext } from "react";

export type CartContextType = {
  cart: { id: number; quantity: number }[];
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  increaseQuantity: (itemId: number) => void;
  decreaseQuantity: (itemId: number) => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
