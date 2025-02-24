import { CartContext } from "@/hooks/use-cart";
import { createContext, useEffect, useState } from "react";

export type CartContextType = {
  cart: number[];
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState([] as number[]);

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCart(JSON.parse(cart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (itemId: number) => {
    setCart([...cart, itemId]);
    localStorage.setItem("cart", JSON.stringify([...cart, itemId]));
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item !== itemId));
    localStorage.setItem(
      "cart",
      JSON.stringify(cart.filter((item) => item !== itemId))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
