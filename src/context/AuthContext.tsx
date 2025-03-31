import { AuthContext } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token") as string);
    }
    if (localStorage.getItem("role")) {
      setRole(localStorage.getItem("role") as string);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
