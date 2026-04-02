"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { getNavigation } from "@modules/navigation/services/navigation.service";
import { useAuthStore } from "@store/auth.store";
import { useNavigationStore } from "@store/navigation.store";

let hasInitializedAuth = false;
let hasInitializedNavigation = false;

export default function RootInit() {
  const { isLoaded, token, loadAuth } = useAuthStore(
    useShallow((state) => ({
      isLoaded: state.isLoaded,
      token: state.auth.token,
      loadAuth: state.loadFromStorage,
    }))
  );
  const { loadMenu, setMenu } = useNavigationStore(
    useShallow((state) => ({
      loadMenu: state.loadFromStorage,
      setMenu: state.setMenu,
    }))
  );

  useEffect(() => {
    if (hasInitializedAuth) return;

    hasInitializedAuth = true;
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (!isLoaded || hasInitializedNavigation) return;

    hasInitializedNavigation = true;
    loadMenu();

    if (!token) return;

    let isActive = true;

    getNavigation()
      .then((menu) => {
        if (!isActive) return;

        setMenu(menu);
      })
      .catch((error) => {
        if (!isActive) return;

        console.error("Navigation load failed:", error);
      });

    return () => {
      isActive = false;
    };
  }, [isLoaded, token, loadMenu, setMenu]);

  return null;
}
