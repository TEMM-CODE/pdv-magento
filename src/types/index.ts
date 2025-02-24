export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  phone: string;
  taxvat: string;
  address?: string;
}

export type UserRole =
  | "ADMIN"
  | "SUPERVISOR"
  | "CASHIER"
  | "CUSTOMER"
  | "EMPLOYEE";

export type LayoutRole =
  | "admin"
  | "employee"
  | "customer"
  | "supervisor"
  | "self-service";

export interface Product {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  weight: number;
  extension_attributes: {
    website_ids: Array<number>;
    category_links: Array<{
      position: number;
      category_id: string;
    }>;
    configurable_product_options: Array<{
      id: number;
      attribute_id: string;
      label: string;
      position: number;
      values: Array<{
        value_index: number;
      }>;
      product_id: number;
    }>;
    configurable_product_links: Array<number>;
  };
  product_links: [];
  options: [];
  media_gallery_entries: Array<{
    id: number;
    media_type: string;
    label: string;
    position: number;
    disabled: boolean;
    types: Array<string>;
    file: string;
  }>;
  tier_prices: [];
  custom_attributes: Array<{
    attribute_code: string;
    value: string;
  }>;
}

export interface ProductList {
  items: Product[];
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  items: CartItem[];
  total: number;
  employeeId: number;
  employeeName: string;
  date: string;
  status: "COMPLETED" | "CANCELLED";
  paymentMethod: "CREDIT" | "DEBIT" | "CASH" | "PIX";
}

export interface SupervisorOperation {
  id: number;
  type: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedBy: number;
  timestamp: string;
  registerId: number;
}
