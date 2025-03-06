import { SupervisorOperation } from "@/types";

// Mock data for pending authorizations
let mockPendingAuthorizations: SupervisorOperation[] = [
  {
    id: 1,
    type: "Sangria",
    amount: 500,
    status: "PENDING",
    requestedBy: 3,
    timestamp: new Date().toISOString(),
    registerId: 1,
  },
  {
    id: 2,
    type: "Troca",
    amount: 150,
    status: "PENDING",
    requestedBy: 3,
    timestamp: new Date().toISOString(),
    registerId: 2,
  },
];

export const supervisorApi = {
  async getPendingAuthorizations(): Promise<SupervisorOperation[]> {
    return mockPendingAuthorizations;
  },

  async getPendingSupervisorOperations(): Promise<SupervisorOperation[]> {
    return mockPendingAuthorizations;
  },

  async approveAuthorization(id: number): Promise<void> {
    const operation = mockPendingAuthorizations.find((op) => op.id === id);
    if (!operation) throw new Error("Operation not found");
    operation.status = "APPROVED";
  },

  async rejectAuthorization(id: number): Promise<void> {
    const operation = mockPendingAuthorizations.find((op) => op.id === id);
    if (!operation) throw new Error("Operation not found");
    operation.status = "REJECTED";
  },

  async checkAuthorizationStatus(
    id: number
  ): Promise<SupervisorOperation | null> {
    const operation = mockPendingAuthorizations.find((op) => op.id === id);
    return operation || null;
  },

  async requestAuthorization(request: {
    type: string;
    amount: number;
    timestamp: string;
  }): Promise<{ id: number }> {
    const newOperation: SupervisorOperation = {
      id: mockPendingAuthorizations.length + 1,
      ...request,
      status: "PENDING",
      requestedBy: 3,
      registerId: 1,
    };
    mockPendingAuthorizations.push(newOperation);
    return { id: newOperation.id };
  },
};
