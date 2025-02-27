import { User } from "@/types";
import { delay } from "./utils";
import { axiosApi } from "../api";

// Mock users data
const mockUsers: User[] = [];

export const userApi = {
  async getUsers(): Promise<User[]> {
    await delay(500);
    return mockUsers;
  },

  async getUser(): Promise<User> {
    return axiosApi
      .get<User>(`/customers/me`)
      .then((response) => response.data);
  },

  async createUser(
    user: Omit<User, "id" | "role" | "adress">,
    password: string
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
    return axiosApi
      .put(`/customers/me`, user)
      .then((response) => response.data);
  },

  async deleteUser(id: number): Promise<void> {
    await delay(500);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Usuário não encontrado");
    mockUsers.splice(index, 1);
  },
};
