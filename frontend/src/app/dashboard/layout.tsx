"use client";

import Sidebar from "@shared/components/layout/Sidebar";
import Navbar from "@shared/components/layout/Navbar";
import { SidebarProvider } from "@core/contexts/SidebarContext";

import "@fortawesome/fontawesome-free/css/all.min.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <div className="page-container">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
