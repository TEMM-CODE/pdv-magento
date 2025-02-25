import { LoginCredentials } from "@/types/auth";
import { API_URL, axiosApi } from "./api";

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    const token = axiosApi
      .post<string>(`${API_URL}/integration/customer/token`, {
        username: credentials.email,
        password: credentials.password,
      })
      .then((response) => response.data);

    if (!token) {
      throw new Error("Usuário não encontrado");
    }

    // Em produção, a senha seria validada pelo backend
    return token;
  },
};
