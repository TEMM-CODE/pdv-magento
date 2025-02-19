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
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  barcode: string;
  cost: number;
  minStock: number;
  imageUrl: string;
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
