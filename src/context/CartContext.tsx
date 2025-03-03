import { CartContext } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (itemId: number) => {
    const newCart = [...cart, { id: itemId, quantity: 1 }];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item.id !== itemId));
    localStorage.setItem(
      "cart",
      JSON.stringify(cart.filter((item) => item.id !== itemId))
    );
  };

  const increaseQuantity = (itemId: number) => {
    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const decreaseQuantity = (itemId: number) => {
    setCart(
      cart.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
