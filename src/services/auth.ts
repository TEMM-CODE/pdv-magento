import { LoginCredentials } from "@/types/auth";
import { API_URL } from "./api/users";

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    const token = await fetch(`${API_URL}/integration/customer/token`, {
      body: JSON.stringify(credentials),
      method: "POST",
    }).then((response) => response.json());

    if (!token) {
      throw new Error("Usuário não encontrado");
    }

    // Em produção, a senha seria validada pelo backend
    return token;
  },
};
