"use client";

import { useState } from "react";

import Sidebar from "@shared/components/layout/Sidebar";
import Navbar from "@shared/components/layout/Navbar";

import "@fortawesome/fontawesome-free/css/all.min.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} />

      <div className="main-area">
        <Navbar toggleSidebar={() => setCollapsed((prev) => !prev)} />

        <div className="page-container">{children}</div>
      </div>
    </div>
  );
}