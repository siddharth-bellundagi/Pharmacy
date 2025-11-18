import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  role: "admin" | "staff";
  permissions: string[];
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem("pharmacy_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    if (username === "admin" && password === "admin123") {
      const adminUser: User = {
        id: "1",
        username: "admin",
        role: "admin",
        permissions: ["all"],
        name: "Admin User",
        email: "admin@pharmacy.com",
      };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem("pharmacy_user", JSON.stringify(adminUser));
      return true;
    } else if (username === "staff" && password === "staff123") {
      const staffUser: User = {
        id: "2",
        username: "staff",
        role: "staff",
        permissions: ["sales", "inventory_view"],
        name: "Staff User",
        email: "staff@pharmacy.com",
      };
      setUser(staffUser);
      setIsAuthenticated(true);
      localStorage.setItem("pharmacy_user", JSON.stringify(staffUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("pharmacy_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
