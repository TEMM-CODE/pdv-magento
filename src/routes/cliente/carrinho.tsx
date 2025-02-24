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
import { useCallback } from "react";

export const Route = createFileRoute("/cliente/carrinho")({
  component: Cart,
});

// Mock do carrinho - será substituído pela integração real
const cartItems = [
  {
    id: 1,
    productId: 1,
    productName: "Coca-Cola 350ml",
    quantity: 2,
    price: 5.0,
    subtotal: 10.0,
    product: {
      id: 1,
      name: "Coca-Cola 350ml",
      description: "Refrigerante Coca-Cola Lata 350ml",
      price: 5.0,
      stock: 100,
      category: "Bebidas",
    },
  },
];

export default function Cart() {
  const { addToCart, cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  const { data: products } = useQuery({
    queryKey: ["products", cart],
    queryFn: () => productApi.getProductsByIds(cart),
  });

  const updateQuantity = (itemId: number, newQuantity: number) => {
    // TODO: Implement quantity update
  };

  const removeItem = (itemId: number) => {
    // TODO: Implement remove item
  };

  return (
    <Layout role="customer">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Carrinho</h1>

        {products?.items === undefined || products?.items.length === 0 ? (
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
            <div className="space-y-4">
              {products.items.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(product.id, product.quantity - 1)
                          }
                          disabled={product.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            updateQuantity(product.id, parseInt(e.target.value))
                          }
                          className="w-20 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(product.id, product.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-bold">
                          R$ {product.price.toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
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
