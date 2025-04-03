import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { ProductList } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/cliente/loja")({
  component: Store,
});

export default function Store() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart, removeFromCart, cart } = useCart();
  const pageSize = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const { data: products, isLoading } = useQuery<ProductList>({
    queryKey: ["products", currentPage, pageSize],
    queryFn: () => api.getProducts(pageSize, currentPage),
  });

  const filteredProducts = products?.items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => console.log(cart), [cart]);

  return (
    <Layout role="customer">
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-heading">Loja Online</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buscar Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="flex-1 space-y-2">
                <Label htmlFor="search">Buscar por nome ou descrição</Label>
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

        {filteredProducts?.length === 0 ? (
          <div
            className="text-center py-12"
            style={{ height: "calc(100vh - 442px)" }}
          >
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        ) : isLoading ? (
          <div
            className="flex items-center justify-center min-h-[400px]"
            style={{ height: "calc(100vh - 442px)" }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-primary"></div>
          </div>
        ) : (
          <ScrollArea className="pb-5 h-[calc(100vh_-_442px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts?.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {
                        product.custom_attributes.find(
                          (attr) => attr.attribute_code === "description",
                        )?.value
                      }
                    </p>
                    <p className="mt-4 text-2xl font-bold">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </CardContent>
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
                          addToCart(product.id, product.price);
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
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            <PaginationPrevious />
          </PaginationItem>
          {currentPage > 1 && (
            <PaginationItem onClick={() => setCurrentPage(currentPage - 1)}>
              <PaginationLink>{currentPage - 1}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              isActive
              className="bg-primary text-white hover:bg-primary/80 hover:text-white"
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem onClick={() => setCurrentPage(currentPage + 1)}>
            <PaginationLink>{currentPage + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem onClick={() => setCurrentPage(currentPage + 1)}>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Layout>
  );
}
