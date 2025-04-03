import { User } from "@/types";
import { axiosApi } from "../api";

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    role: "EMPLOYEE",
    taxvat: "123456789",
    addresses: [
      {
        region: {
          region_code: "US-CA",
          region: "California",
          region_id: 1,
          extension_attributes: {},
        },
        country_id: "US",
        street: ["123 Main St", "Suite 100"],
        city: "Los Angeles",
        postcode: "90001",
        telephone: "+1 555-1234",
        default_shipping: true,
      },
    ],
  },
  {
    id: 2,
    firstname: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    role: "EMPLOYEE",
    taxvat: "987654321",
    addresses: [
      {
        region: {
          region_code: "US-NY",
          region: "New York",
          region_id: 2,
          extension_attributes: {},
        },
        country_id: "US",
        street: ["456 Elm St", "Apt 12B"],
        city: "New York",
        postcode: "10001",
        telephone: "+1 555-5678",
        default_billing: true,
      },
    ],
  },
];

export const userApi = {
  async getUsers(): Promise<User[]> {
    return mockUsers;
  },

  async getUser(): Promise<User> {
    return axiosApi
      .get<User>(`/customers/me`)
      .then((response) => response.data);
  },

  async createUser(
    user: Omit<User, "id" | "role" | "adress">,
    password: string,
  ): Promise<User> {
    const newUser = {
      customer: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        taxvat: user.taxvat,
      },
      password: password,
    };

    return axiosApi
      .post<User>("/customers", newUser)
      .then((response) => response.data);
  },

  async updateUser(user: Partial<User>): Promise<User> {
    const updatedUser = { customer: { ...user } };
    return axiosApi
      .put<User>(`/customers/me`, updatedUser)
      .then((response) => response.data);
  },

  async deleteUser(id: number): Promise<void> {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Usuário não encontrado");
    mockUsers.splice(index, 1);
  },
};
