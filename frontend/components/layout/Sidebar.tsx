"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Module, SubModule, Page } from "@/types/menu.types";
import Link from "next/link";

// font-awesome icons
const ICON_MAP: Record<string, string> = {
  // --- CORE MODULES ---
  "System Setup & Configuration": "fa-solid fa-gears",
  "Institution Profile": "fa-solid fa-school",
  "Academic Management": "fa-solid fa-book-open-reader",
  "Master Data": "fa-solid fa-database",
  "Administration & Security": "fa-solid fa-user-shield",
  
  // --- MANAGEMENT MODULES ---
  "Student Management": "fa-solid fa-user-graduate",
  "Admission Management": "fa-solid fa-file-signature",
  "Staff Management": "fa-solid fa-chalkboard-user",
  "HR & Payroll": "fa-solid fa-address-card",
  // --- NEW MODULES REQUESTED ---
  "Fee Management": "fa-solid fa-file-invoice-dollar",
  "Accounts & Finance": "fa-solid fa-scale-balanced",
  "Transport Management": "fa-solid fa-bus-simple",
  "Library Management": "fa-solid fa-book-bookmark",
  "Inventory & Purchase": "fa-solid fa-boxes-stacked",
  "Hostel Management": "fa-solid fa-bed",
  "Communication & Notification": "fa-solid fa-bullhorn",
  "Visitor & Gate Management": "fa-solid fa-id-card-clip",
  "Grievance & Helpdesk": "fa-solid fa-headset",
  "Event Management": "fa-solid fa-calendar-check",
  "Reports & Analytics": "fa-solid fa-chart-line",
  "Integrations": "fa-solid fa-puzzle-piece",

  // --- DEFAULT ---
  "Default": "fa-solid fa-layer-group"
};

type SidebarProps = {
  collapsed: boolean;
};

export default function Sidebar({ collapsed }: SidebarProps) {
  const { menu, isLoaded } = useAuth();
  const pathname = usePathname();

  const [openModule, setOpenModule] = useState<string | null>(null);

  // ?? Scoped submodule state (important)
  const [openSubModule, setOpenSubModule] = useState<{
    module: string;
    submodule: string;
  } | null>(null);

  // ?? Auto-open based on route
  useEffect(() => {
    menu.forEach((module) => {
      module.submodules?.forEach((sub) => {
        sub.pages?.forEach((page) => {
          if (page.route === pathname) {
            setOpenModule(module.module);
            setOpenSubModule({
              module: module.module,
              submodule: sub.submodule,
            });
          }
        });
      });
    });
  }, [pathname, menu]);

  if (!isLoaded) return null;

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* HEADER */}
      <div className="sidebar-title">
        <i className="fa-solid fa-school"></i>
        {!collapsed && <span>School ERP</span>}
      </div>

      {/* MENU */}
      <div className="sidebar-content">
        {menu.map((module: Module) => {
          const isOpen = openModule === module.module;

          return (
            <div key={module.module}>

              {/* ================= LEVEL 1 ================= */}
              <button
                type="button"
                className={`nav-module ${isOpen ? "active-module" : ""}`}
                onClick={() => {
                  if (!collapsed) {
                    setOpenModule(isOpen ? null : module.module);
                    setOpenSubModule(null);
                  }
                }}
              >
                <span>
                  <i className={ICON_MAP[module.module] || ICON_MAP["Default"]}></i>                 
                   {!collapsed && <span>{module.module}</span>}
                </span>

                {!collapsed && (
                  <i
                    className={`fa-solid fa-chevron-right ${isOpen ? "rotate" : ""}`}
                  />
                )}
              </button>

              {/* ================= LEVEL 2 ================= */}
              <div className={`submenu ${isOpen && !collapsed ? "open" : ""}`}>
                {module.submodules?.map((sub: SubModule) => {
                  const isSubOpen =
                    openSubModule?.module === module.module &&
                    openSubModule?.submodule === sub.submodule;

                  return (
                    <div key={sub.submodule}>

                      {/* SUBMODULE */}
                      {!collapsed && (
                        <div
                          className="nav-submodule"
                          onClick={() =>
                            setOpenSubModule(
                              isSubOpen
                                ? null
                                : {
                                  module: module.module,
                                  submodule: sub.submodule,
                                }
                            )
                          }
                        >
                          <span>{sub.submodule}</span>

                          <i
                            className={`fa-solid fa-chevron-right ${isSubOpen ? "rotate" : ""}`}
                          />
                        </div>
                      )}

                      {/* ================= LEVEL 3 ================= */}
                      <div className={`submenu ${isSubOpen ? "open" : ""}`}>
                        {sub.pages?.map((page: Page) => (
                          <Link
                            key={page.route}
                            href={page.route}
                            className={`nav-page ${pathname === page.route ? "active-page" : ""
                              }`}
                          >
                            <i className="fa-regular fa-circle-dot"></i>
                            {!collapsed && <span>{page.page_name}</span>}
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