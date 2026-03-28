"use client";

import { useEffect } from "react";

import { useAuthStore } from "@store/auth.store";
import { useNavigationStore } from "@store/navigation.store";

import { getNavigation } from "@modules/navigation/services/navigation.service";

export default function RootInit() {
  const isLoaded = useAuthStore((s) => s.isLoaded);
  const loadAuth = useAuthStore((s) => s.loadFromStorage);

  const loadMenu = useNavigationStore((s) => s.loadFromStorage);
  const setMenu = useNavigationStore((s) => s.setMenu);

  // ✅ STEP 1: Load auth
  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  // ✅ STEP 2: Load navigation (NO TOKEN CHECK ❌)
  useEffect(() => {
    if (!isLoaded) return;

    // Load cached menu first
    loadMenu();

    // Always call API (cookie will handle auth)
    getNavigation()
      .then((data) => {
        console.log("✅ NAV API RESPONSE:", data);

        setMenu(data);
      })
      .catch((err) => {
        console.error("❌ Navigation load failed:", err);
      });
  }, [isLoaded, loadMenu, setMenu]);

  return null;
}