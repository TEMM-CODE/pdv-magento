import { Product, ProductList, StockItem } from "@/types";
import { axiosApi } from "../api";

// Mock products data
const mockProducts: Product[] = [];

export const productApi = {
  async getProducts(
    pageSize: number,
    currentPage: number
  ): Promise<ProductList> {
    return axiosApi
      .get<ProductList>(
        `/products?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=&searchCriteria[filter_groups][0][filters][0][condition_type]=neq&searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${currentPage}`
      )
      .then((response) => response.data);
  },

  async getProduct(id: number): Promise<Product> {
    return axiosApi
      .get<Product>(
        `/products?searchCriteria[filter_groups][0][filters][0][field]=entity_id&searchCriteria[filter_groups][0][filters][0][value]=${id}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`
      )
      .then((response) => response.data);
  },

  async getProductsByIds(ids: number[]): Promise<ProductList> {
    const idsWithCommas = ids.join(",");
    const url = `/products?searchCriteria[filter_groups][0][filters][0][field]=entity_id&searchCriteria[filter_groups][0][filters][0][value]=${idsWithCommas}&searchCriteria[filter_groups][0][filters][0][condition_type]=in`;
    return axiosApi.get<ProductList>(url).then((response) => response.data);
  },

  async getStockBySku(sku: string): Promise<StockItem> {
    return axiosApi
      .get<StockItem>(`/stockItems/${sku}`)
      .then((response) => response.data);
  },

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const newProduct = {
      id: mockProducts.length + 1,
      ...product,
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Produto não encontrado");
    mockProducts[index] = { ...mockProducts[index], ...product };
    return mockProducts[index];
  },

  async deleteProduct(id: number): Promise<void> {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Produto não encontrado");
    mockProducts.splice(index, 1);
  },
};
