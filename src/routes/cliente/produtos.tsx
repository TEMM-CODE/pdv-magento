import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/cliente/produtos")({
  component: CustomerProducts,
});

export default function CustomerProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { addToCart, removeFromCart, cart } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
  });

  const filteredProducts = products?.items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Layout role="customer">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="customer">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Produtos</h1>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar por nome</Label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite para buscar..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {
                    product.custom_attributes.find(
                      (attr) => attr.attribute_code === "description"
                    )?.value
                  }
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Preço:</span>
                    <span>R$ {product.price.toFixed(2)}</span>
                  </div>
                  <CardFooter>
                    {cart.find((item) => item.id === product.id) ? (
                      <Button
                        className="w-full"
                        onClick={() => {
                          removeFromCart(product.id);
                          toast({
                            title: "Produto removido do carrinho",
                            description:
                              "O produto foi removido do seu carrinho com sucesso!",
                          });
                        }}
                      >
                        Remover do Carrinho
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => {
                          addToCart(product.id);
                          toast({
                            title: "Produto adicionado ao carrinho",
                            description:
                              "O produto foi adicionado ao seu carrinho com sucesso!",
                          });
                        }}
                      >
                        Adicionar ao Carrinho
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
