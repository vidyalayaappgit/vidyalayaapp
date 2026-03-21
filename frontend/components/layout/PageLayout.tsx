"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function PageLayout({ children, title }: any) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} />

      <div className="page-container">
        <div className="page-title">{title}</div>

        {children}
      </div>
    </div>
  );
}