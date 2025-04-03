import { useCallback, useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ProductDialog } from "@/components/products/ProductDialog";
import { Product } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { createFileRoute } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/admin/produtos")({
  component: Products,
});

export default function Products() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const pageSize = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [productsWithStock, setProductsWithStock] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined,
  );

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", currentPage, pageSize],
    queryFn: () => api.getProducts(pageSize, currentPage),
  });

  // desativando temporariamente
  // const fetchStock = useCallback(() => {
  //   const getStock = async () => {
  //     const updatedProducts = await Promise.all(
  //       products?.items.map(async (product) => {
  //         const response = await api.getStockBySku(product.sku);
  //         return {
  //           ...product,
  //           extension_attributes: {
  //             ...product.extension_attributes,
  //             stock_item: response,
  //           },
  //         };
  //       }) ?? [],
  //     );
  //     setProductsWithStock(updatedProducts);
  //   };

  //   getStock().catch((error) => {
  //     console.error("Error fetching stock:", error);
  //   });
  // }, [products?.items]);

  // useEffect(() => {
  //   fetchStock();
  // }, [fetchStock]);

  const filteredProducts = products?.items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (productId: number) => {
    try {
      await api.deleteProduct(productId);
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleNewProduct = () => {
    setSelectedProduct(undefined);
    setDialogOpen(true);
  };

  return (
    <Layout role="admin">
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between flex-col xsm:flex-row gap-4">
          <h1 className="text-3xl font-bold font-heading">Produtos</h1>
          <Button onClick={handleNewProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>

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

        {isLoading ? (
          <div
            className="flex items-center justify-center min-h-[400px]"
            style={{ height: "calc(100vh - 442px)" }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-primary"></div>
          </div>
        ) : (
          <ScrollArea className="pb-5 h-[calc(100vh_-_442px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {filteredProducts?.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {
                        product.custom_attributes.find(
                          (attr) => attr.attribute_code === "description",
                        )?.value
                      }
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Preço:</span>
                        <span>R$ {product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Estoque:</span>
                        <span>
                          {product.extension_attributes.stock_item?.qty}
                          unidades
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Categoria:</span>
                        <span>
                          {
                            product.extension_attributes.category_links[1]
                              .category_id
                          }
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={selectedProduct}
        />
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
