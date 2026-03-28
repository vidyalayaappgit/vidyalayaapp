"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useNavigationStore } from "@store/navigation.store";

// ✅ TYPES (STRING BASED - MATCH BACKEND)
import type {
  Module,
  SubModule,
  Page,
} from "@modules/navigation/types/navigation.types";

type SidebarProps = {
  collapsed: boolean;
};

// 🔥 ICON MAP
const ICON_MAP: Record<string, string> = {
  "Student Management": "fa-solid fa-user-graduate",
  "Admission Management": "fa-solid fa-file-signature",
  "Fee Management": "fa-solid fa-file-invoice-dollar",
  "Transport Management": "fa-solid fa-bus",
  "Library Management": "fa-solid fa-book",
  Default: "fa-solid fa-layer-group",
};

export default function Sidebar({ collapsed }: SidebarProps) {
  const menu = useNavigationStore((s) => s.menu);
  const pathname = usePathname();

  // ✅ FIXED → STRING STATE (NOT NUMBER)
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [openSubModule, setOpenSubModule] = useState<string | null>(null);

  // 🔥 AUTO OPEN BASED ON ROUTE (NULL SAFE)
  useEffect(() => {
     console.log("MENU DATA:", menu);
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
      
      {/* HEADER */}
      <div className="sidebar-title">
        <i className="fa-solid fa-school"></i>
        {!collapsed && <span>School ERP</span>}
      </div>

      {/* MENU */}
      <div className="sidebar-content">
        {menu.map((module: Module) => {
          const isModuleOpen = openModule === module.module;

          return (
            <div key={`module-${module.module}`}>

              {/* ===== LEVEL 1 ===== */}
              <button
                type="button"
                className={`nav-module ${isModuleOpen ? "active-module" : ""}`}
                onClick={() => {
                  if (!collapsed) {
                    setOpenModule(isModuleOpen ? null : module.module);
                    setOpenSubModule(null);
                  }
                }}
              >
                <span>
                  <i
                    className={
                      ICON_MAP[module.module] || ICON_MAP.Default
                    }
                  />
                  {!collapsed && <span>{module.module}</span>}
                </span>

                {!collapsed && (
                  <i
                    className={`fa-solid fa-chevron-right ${
                      isModuleOpen ? "rotate" : ""
                    }`}
                  />
                )}
              </button>

              {/* ===== LEVEL 2 ===== */}
              <div
                className={`submenu ${
                  isModuleOpen && !collapsed ? "open" : ""
                }`}
              >
                {module.submodules?.map((sub: SubModule) => {
                  const isSubOpen = openSubModule === sub.submodule;

                  return (
                    <div key={`sub-${module.module}-${sub.submodule}`}>

                      {/* SUBMODULE */}
                      {!collapsed && (
                        <div
                          className="nav-submodule"
                          onClick={() =>
                            setOpenSubModule(
                              isSubOpen ? null : sub.submodule
                            )
                          }
                        >
                          <span>{sub.submodule}</span>

                          <i
                            className={`fa-solid fa-chevron-right ${
                              isSubOpen ? "rotate" : ""
                            }`}
                          />
                        </div>
                      )}

                      {/* ===== LEVEL 3 ===== */}
                      <div
                        className={`submenu ${
                          isSubOpen ? "open" : ""
                        }`}
                      >
                        {Array.isArray(sub.pages) &&
                          sub.pages.map((page: Page) => (
                            <Link
                              key={`page-${module.module}-${sub.submodule}-${page.page_name}`}
                              href={page.route}
                              className={`nav-page ${
                                pathname === page.route
                                  ? "active-page"
                                  : ""
                              }`}
                            >
                              <i className="fa-regular fa-circle-dot"></i>
                              {!collapsed && (
                                <span>{page.page_name}</span>
                              )}
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