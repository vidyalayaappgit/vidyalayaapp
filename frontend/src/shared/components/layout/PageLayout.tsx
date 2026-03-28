"use client";

import { useState } from "react";
import Sidebar from "@shared/components/layout/Sidebar";
import Navbar from "@shared/components/layout/Navbar";

export default function PageLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} />

      <div className="page-container">
        <Navbar toggleSidebar={() => setCollapsed((prev) => !prev)} />

        <div className="page-title">{title}</div>

        {children}
      </div>
    </div>
  );
}