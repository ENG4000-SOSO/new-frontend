import { createContext, ReactNode, useContext, useState } from "react";

function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = window.atob(payload);
    return JSON.parse(decodedPayload);
  } catch (e) {
    throw new Error("Invalid token");
  }
}

// Update the User interface to include role
interface User {
  username: string;
  token: string;
  role: string;
}

interface DecodedToken {
  name: string;
  id: number;
  role: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (userData: { username: string; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};