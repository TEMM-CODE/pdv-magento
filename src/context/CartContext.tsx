import { CartContext } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<
    { id: number; quantity: number; price: number }[]
  >([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    setTotal(totalPrice);
  }, [cart]);

  const addToCart = (itemId: number, price: number) => {
    const newCart = [...cart, { id: itemId, quantity: 1, price: price }];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item.id !== itemId));
    localStorage.setItem(
      "cart",
      JSON.stringify(cart.filter((item) => item.id !== itemId)),
    );
  };

  const increaseQuantity = (itemId: number) => {
    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const decreaseQuantity = (itemId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
