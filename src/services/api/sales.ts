import { Sale } from "@/types";

// Mock sales data
const mockSales: Sale[] = [
  {
    id: 1,
    items: [
      {
        id: 1,
        productId: 1,
        productName: "Coca-Cola 350ml",
        quantity: 2,
        price: 5.0,
        subtotal: 10.0,
      },
    ],
    total: 10.0,
    employeeId: 2,
    employeeName: "Funcionário",
    date: new Date().toISOString(),
    status: "COMPLETED",
    paymentMethod: "CREDIT",
  },
];

export const salesApi = {
  async getSales(): Promise<Sale[]> {
    return mockSales;
  },
};
