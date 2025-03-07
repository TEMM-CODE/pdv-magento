import { LoginCredentials } from "@/types/auth";
import { API_URL, axiosApi } from "./api";

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<{ token: string; role: string }> {
    const roles = ["cliente", "admin"];

    for (const role of roles) {
      try {
        const response = await axiosApi.post<string>(
          `${API_URL}/integration/${role}/token`,
          { username: credentials.email, password: credentials.password }
        );
        return { token: response.data, role };
      } catch (error) {
        console.log(`${role} authentication failed`);
      }
    }

    throw new Error("Usuário não encontrado");
  },
};
