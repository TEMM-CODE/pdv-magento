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

export const Route = createFileRoute("/cliente/carrinho")({
  component: Cart,
});

export default function Cart() {
  const { cart, total, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const navigate = useNavigate();

  const { data: products } = useQuery({
    queryKey: ["products", cart],
    queryFn: () => productApi.getProductsByIds(cart.map((item) => item.id)),
  });

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
                          onClick={() => decreaseQuantity(product.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={
                            cart.find((item) => item.id === product.id)
                              ?.quantity
                          }
                          className="w-20 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => increaseQuantity(product.id)}
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
