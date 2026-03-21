"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getNavigation } from "@/modules/navigation/services/navigation.service";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import "@fortawesome/fontawesome-free/css/all.min.css";
export default function DashboardLayout({ children }: any) {
  const { auth, menu, setNavigation } = useAuth();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!auth?.user) {
      router.push("/login");
      return;
    }

    if (!menu || menu.length === 0) {
      getNavigation()
        .then(setNavigation)
        .catch(() => console.log("Navigation failed"));
    }
  }, [auth]);

  if (!auth?.user) return null;

  return (
    <div className="layout">

      <Sidebar collapsed={collapsed} />

      <div className="main-area">
        <Navbar toggleSidebar={() => setCollapsed(!collapsed)} />

        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
}