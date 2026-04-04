// D:\schoolapp\frontend\src\core\contexts\SidebarContext.tsx
// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";

// type SidebarContextType = {
//   collapsed: boolean;
//   toggleSidebar: () => void;
// };

// const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// export function SidebarProvider({ children }: { children: ReactNode }) {
//   const [collapsed, setCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setCollapsed(!collapsed);
//   };

//   return (
//     <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
//       {children}
//     </SidebarContext.Provider>
//   );
// }

// export function useSidebar() {
//   const context = useContext(SidebarContext);
//   if (context === undefined) {
//     throw new Error("useSidebar must be used within a SidebarProvider");
//   }
//   return context;
// }

// D:\schoolapp\frontend\src\core\contexts\SidebarContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type SidebarContextType = {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}