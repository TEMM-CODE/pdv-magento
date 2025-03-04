import { useCallback, useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ProductDialog } from "@/components/products/ProductDialog";
import { Product } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/produtos")({
  component: Products,
});

export default function Products() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const pageSize = 100;
  const [currentPage, setCurrentPage] = useState(1);
  const [productsWithStock, setProductsWithStock] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", currentPage, pageSize],
    queryFn: () => api.getProducts(pageSize, currentPage),
  });

  const fetchStock = useCallback(() => {
    const getStock = async () => {
      const updatedProducts = await Promise.all(
        products?.items.map(async (product) => {
          const response = await api.getStockBySku(product.sku);
          return {
            ...product,
            extension_attributes: {
              ...product.extension_attributes,
              stock_item: response,
            },
          };
        }) ?? []
      );
      setProductsWithStock(updatedProducts);
    };

    getStock().catch((error) => {
      console.error("Error fetching stock:", error);
    });
  }, [products?.items]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const filteredProducts = productsWithStock.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (isLoading) {
    return (
      <Layout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Produtos</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {
                    product.custom_attributes.find(
                      (attr) => attr.attribute_code === "description"
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
                      {product.extension_attributes.stock_item?.qty} unidades
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
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={selectedProduct}
        />
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem
            onClick={() => setCurrentPage((prevValue) => prevValue - 1)}
          >
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem
            onClick={() => setCurrentPage((prevValue) => prevValue + 1)}
          >
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Layout>
  );
}
