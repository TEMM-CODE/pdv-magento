import { CartContext } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

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
