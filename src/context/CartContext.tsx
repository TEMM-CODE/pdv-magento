import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cart: number[];
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState([] as number[]);

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCart(JSON.parse(cart));
    }
  }, []);

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

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
