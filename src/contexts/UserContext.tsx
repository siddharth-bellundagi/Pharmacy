import React, { createContext, useContext, useState, useEffect } from "react";

export interface SystemUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserContextType {
  users: SystemUser[];
  addUser: (user: Omit<SystemUser, "id" | "createdAt">) => void;
  updateUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteUser: (id: string) => void;
  getUser: (id: string) => SystemUser | undefined;
  getActiveUsers: () => SystemUser[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<SystemUser[]>([]);

  useEffect(() => {
    const sampleUsers: SystemUser[] = [
      {
        id: "1",
        username: "admin",
        name: "Admin User",
        email: "admin@pharmacy.com",
        role: "admin",
        permissions: ["all"],
        isActive: true,
        createdAt: "2024-01-01",
        lastLogin: new Date().toISOString(),
      },
      {
        id: "2",
        username: "staff",
        name: "Staff User",
        email: "staff@pharmacy.com",
        role: "staff",
        permissions: ["sales", "inventory_view"],
        isActive: true,
        createdAt: "2024-01-02",
        lastLogin: "2024-01-20",
      },
    ];

    const storedUsers = localStorage.getItem("pharmacy_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(sampleUsers);
      localStorage.setItem("pharmacy_users", JSON.stringify(sampleUsers));
    }
  }, []);

  const addUser = (userData: Omit<SystemUser, "id" | "createdAt">) => {
    const newUser: SystemUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("pharmacy_users", JSON.stringify(updatedUsers));
  };

  const updateUser = (id: string, updates: Partial<SystemUser>) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("pharmacy_users", JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("pharmacy_users", JSON.stringify(updatedUsers));
  };

  const getUser = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const getActiveUsers = () => {
    return users.filter((user) => user.isActive);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        getUser,
        getActiveUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserManagement must be used within a UserProvider");
  }
  return context;
};
