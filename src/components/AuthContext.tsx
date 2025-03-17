import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  fullName: string;
  userId: string | null;
  userType: string | null;
  isLoading: boolean;
  login: (
    token: string,
    fullName: string,
    userId: string,
    userType: string,
  ) => void;
  logout: () => void;
}

interface JwtPayload {
  userId: string;
  type: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  fullName: "",
  userId: null,
  userType: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState({
    isLoggedIn: false,
    fullName: "",
    userId: null as string | null,
    userType: null as string | null,
    isLoading: true,
  });

  const validateToken = (token: string): JwtPayload | null => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime ? decoded : null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      const fullName = Cookies.get("fullName");
      const cookieUserId = Cookies.get("userId");
      const cookieUserType = Cookies.get("userType");

      if (!token) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const decoded = validateToken(token);
      if (!decoded || decoded.userId !== cookieUserId) {
        logout();
        return;
      }

      setState({
        isLoggedIn: true,
        fullName: fullName || "",
        userId: decoded.userId,
        userType: decoded.type,
        isLoading: false,
      });
    };

    checkAuth();
  }, []);

  const login = (
    token: string,
    fullName: string,
    userId: string,
    userType: string,
  ) => {
    const cookieOptions = {
      secure: import.meta.env.PROD,
      sameSite: "strict" as const,
      expires: new Date(jwtDecode<JwtPayload>(token).exp * 1000),
    };

    Cookies.set("token", token, cookieOptions);
    Cookies.set("fullName", fullName, cookieOptions);
    Cookies.set("userId", userId, cookieOptions);
    Cookies.set("userType", userType, cookieOptions);

    setState({
      isLoggedIn: true,
      fullName,
      userId,
      userType,
      isLoading: false,
    });
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("fullName");
    Cookies.remove("userId");
    Cookies.remove("userType");
    setState({
      isLoggedIn: false,
      fullName: "",
      userId: null,
      userType: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
