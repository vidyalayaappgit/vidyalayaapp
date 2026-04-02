"use client";

import { createContext, useContext, ReactNode } from 'react';

interface PageInfo {
  page_id: number;
  page_name: string;
  page_code: string;
  module_code: string;
  sub_module_code: string;
  route: string;
}

interface PageContextType {
  apiBasePath: string | null;
  pageInfo: PageInfo | null;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ 
  children, 
  apiBasePath, 
  pageInfo 
}: { 
  children: ReactNode; 
  apiBasePath: string | null;
  pageInfo: PageInfo | null;
}) => {
  return (
    <PageContext.Provider value={{ apiBasePath, pageInfo }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within PageProvider');
  }
  return context;
};