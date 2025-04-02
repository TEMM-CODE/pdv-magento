import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api/products";
import { memo, useMemo } from "react";
import { Product } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const CartItem = memo(function CartItem({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-destructive absolute top-5 right-4"
      >
        <Trash2 className="!h-5 !w-5" />
      </Button>
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Button variant="outline" size="icon" onClick={onDecrease}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              className="w-20 text-center"
              min="1"
              readOnly
            />
            <Button variant="outline" size="icon" onClick={onIncrease}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export const Route = createFileRoute("/cliente/carrinho")({
  component: Cart,
});

export default function Cart() {
  const { cart, total, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const navigate = useNavigate();

  const cartItemIds = useMemo(() => cart.map((item) => item.id), [cart]);

  const { data: products } = useQuery({
    queryKey: ["products", cartItemIds],
    queryFn: () => productApi.getProductsByIds(cartItemIds),
    enabled: cartItemIds.length > 0,
  });

  const cartItems = useMemo(() => {
    if (!products?.items) return [];
    return products.items.map((product) => ({
      product,
      quantity: cart.find((item) => item.id === product.id)?.quantity || 0,
    }));
  }, [products?.items, cart]);

  return (
    <Layout role="customer">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-heading">Carrinho</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => navigate({ to: "/cliente/loja" })}
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea style={{ height: "calc(100vh - 442px)" }}>
              <div className="space-y-4">
                {cartItems.map(({ product, quantity }) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    quantity={quantity}
                    onIncrease={() => increaseQuantity(product.id)}
                    onDecrease={() => decreaseQuantity(product.id)}
                    onRemove={() => removeFromCart(product.id)}
                  />
                ))}
              </div>
            </ScrollArea>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-xl">Total</span>
                  <span className="text-2xl">R$ {total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/cliente/loja" })}
                >
                  Continuar Comprando
                </Button>
                <Button onClick={() => navigate({ to: "/cliente/checkout" })}>
                  Finalizar Compra
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
