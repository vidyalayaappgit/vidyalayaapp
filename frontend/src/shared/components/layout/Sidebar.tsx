// D:\schoolapp\frontend\src\shared\components\layout\Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@core/contexts/SidebarContext";
import { useNavigationStore } from "@store/navigation.store";

import type {
  Module,
  SubModule,
  Page,
} from "@modules/navigation/types/navigation.types";

const ICON_MAP: Record<string, string> = {
  "System Setup & Configuration": "fa-solid fa-sliders-h",
  "Administration & Security": "fa-solid fa-shield-alt",
  "Dashboard": "fa-solid fa-tachometer-alt",
  "Academic Management": "fa-solid fa-graduation-cap",
  "Student Management": "fa-solid fa-user-graduate",
  "Admission Management": "fa-solid fa-file-signature",
  "Staff Management": "fa-solid fa-users",
  "HR & Payroll": "fa-solid fa-calculator",
  "Attendance Management": "fa-solid fa-calendar-check",
  "Examination Management": "fa-solid fa-file-alt",
  "Fee Management": "fa-solid fa-file-invoice-dollar",
  "Accounts & Finance": "fa-solid fa-chart-line",
  "Transport Management": "fa-solid fa-bus",
  "Library Management": "fa-solid fa-book",
  Default: "fa-solid fa-layer-group",
};

export default function Sidebar() {
  // Get sidebar state from context
  const { collapsed, toggleSidebar } = useSidebar();
  const menu = useNavigationStore((s) => s.menu);
  const pathname = usePathname();
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [openSubModule, setOpenSubModule] = useState<string | null>(null);

  useEffect(() => {
    for (const module of menu) {
      if (!module.submodules) continue;
      for (const sub of module.submodules) {
        if (!Array.isArray(sub.pages)) continue;
        for (const page of sub.pages) {
          if (page.route === pathname) {
            setOpenModule(module.module);
            setOpenSubModule(sub.submodule);
          }
        }
      }
    }
  }, [pathname, menu]);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Sidebar Header with Hamburger */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <i className="fa-solid fa-school"></i>
          <span>School ERP</span>
        </div>
        {/* Hamburger Button - When clicked, it toggles the sidebar */}
        <button
          className={`sidebar-hamburger ${!collapsed ? "active" : ""}`}
          onClick={toggleSidebar}  // This calls the toggle function from context
        >
          <div className="hamburger-box">
            <div className="hamburger-inner"></div>
            <div className="hamburger-inner"></div>
            <div className="hamburger-inner"></div>
          </div>
        </button>
      </div>

      {/* Menu Items */}
      <div className="sidebar-content">
        {menu.map((module: Module) => {
          const isModuleOpen = openModule === module.module;
          const icon = ICON_MAP[module.module] || ICON_MAP.Default;

          return (
            <div key={`module-${module.module}`}>
              <button
                type="button"
                className={`nav-module ${isModuleOpen ? "active-module" : ""}`}
                
                onClick={() => {
                  if (!collapsed) {
                    setOpenModule(isModuleOpen ? null : module.module);
                    setOpenSubModule(null);
                  }
                }}
                data-tooltip={collapsed ? module.module : undefined}
              >
                <span>
                  <i className={icon} />
                  <span>{module.module}</span>
                </span>
                {!collapsed && (
                  <i className={`fa-solid fa-chevron-right ${isModuleOpen ? "rotate" : ""}`} />
                )}
              </button>

              <div className={`submenu ${isModuleOpen && !collapsed ? "open" : ""}`}>
                {module.submodules?.map((sub: SubModule) => {
                  const isSubOpen = openSubModule === sub.submodule;
                  return (
                    <div key={`sub-${module.module}-${sub.submodule}`}>
                      {!collapsed && (
                        <div
                          className="nav-submodule"
                          onClick={() => setOpenSubModule(isSubOpen ? null : sub.submodule)}
                          data-tooltip={collapsed ? sub.submodule : undefined}
                        >
                          <span>{sub.submodule}</span>
                          <i className={`fa-solid fa-chevron-right ${isSubOpen ? "rotate" : ""}`} />
                        </div>
                      )}
                      <div className={`submenu ${isSubOpen ? "open" : ""}`}>
                        {Array.isArray(sub.pages) &&
                          sub.pages.map((page: Page) => (
                            <Link
                              key={`page-${module.module}-${sub.submodule}-${page.page_name}`}
                              href={page.route}
                              className={`nav-page ${pathname === page.route ? "active-page" : ""}`}
                              data-tooltip={collapsed ? page.page_name : undefined}
                            >
                              <i className="fa-regular fa-circle-dot" />
                              <span>{page.page_name}</span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}