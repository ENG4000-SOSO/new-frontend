import { AuthContext } from "@context/auth/auth_context";
import { User } from "@context/auth/auth_types";
import { ReactNode, useState } from "react";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: { username: string; token: string }) => {
    let decoded: DecodedToken;
    try {
      decoded = decodeJwt(userData.token);
    } catch (e) {
      console.error("Failed to decode token", e);
      return;
    }
    const userWithRole: User = {
      username: userData.username,
      token: userData.token,
      role: decoded.role, // Extracted from token
    };
    setUser(userWithRole);
    localStorage.setItem("user", JSON.stringify(userWithRole));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
