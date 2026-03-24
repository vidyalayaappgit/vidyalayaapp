"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AuthState } from "../types/auth.types";
import { Module } from "../types/menu.types";
import { getNavigation } from "@/modules/navigation/services/navigation.service";

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

  // 🔥 INITIAL LOAD (FAST FROM CACHE)
useEffect(() => {
  const storedAuth = localStorage.getItem("auth");
  const storedMenu = localStorage.getItem("menu");

  if (storedAuth) {
    const parsedAuth = JSON.parse(storedAuth);
    setAuth(parsedAuth);
  }

  if (storedMenu) {
    setMenu(JSON.parse(storedMenu));
  }

  setIsLoaded(true);
}, []);

  // 🔥 ALWAYS FETCH LATEST MENU FROM BACKEND
  useEffect(() => {
    if (auth.token) {
      getNavigation()
        .then((data) => {
          setMenu(data);
          localStorage.setItem("menu", JSON.stringify(data));
        })
        .catch(() => {
          console.error("Navigation load failed");
        });
    }
  }, [auth.token]);

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