"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AuthState } from "../types/auth.types";
import { Module } from "../types/menu.types";

interface AuthContextType {
  auth: AuthState;
  login: (data: any) => void;
  logout: () => void;
  menu: Module[];
  setNavigation: (nav: Module[]) => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [auth, setAuth] = useState<AuthState>({
    token: null,
    user: null,
    permissions: []
  });

  const [menu, setMenu] = useState<Module[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    const storedMenu = localStorage.getItem("menu");

    if (storedAuth) setAuth(JSON.parse(storedAuth));
    if (storedMenu) setMenu(JSON.parse(storedMenu));

    setIsLoaded(true);
  }, []);

  const login = (data: any) => {
    const newAuth: AuthState = {
      token: data.access_token,
      user: data.user,
      permissions: data.permissions || []
    };

    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth({ token: null, user: null, permissions: [] });
    setMenu([]);
    localStorage.removeItem("auth");
    localStorage.removeItem("menu");
  };

  const setNavigation = (nav: Module[]) => {
    setMenu(nav);
    localStorage.setItem("menu", JSON.stringify(nav));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, menu, setNavigation, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext not found");
  return ctx;
};