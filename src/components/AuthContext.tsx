import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Define the shape of the context
interface AuthContextType {
  isLoggedIn: boolean;
  fullName: string;
  userId: string | null;
  login: (token: string, fullName: string, userId: string) => void;
  logout: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  fullName: "",
  userId: "",
  login: () => {},
  logout: () => {},
});

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Check for existing cookies on initial load
  useEffect(() => {
    const token = Cookies.get("token");
    const name = Cookies.get("fullName");
    const userId = Cookies.get("userId");

    if (token && name && userId) {
      setIsLoggedIn(true);
      setFullName(name);
      setUserId(userId);
    }
  }, []);

  const login = (token: string, fullName: string, userId: string) => {
    Cookies.set("token", token);
    Cookies.set("fullName", fullName);
    Cookies.set("userId", userId);
    setIsLoggedIn(true);
    setFullName(fullName);
    setUserId(userId);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("fullName");
    Cookies.remove("userId");
    setIsLoggedIn(false);
    setFullName("");
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, fullName, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};