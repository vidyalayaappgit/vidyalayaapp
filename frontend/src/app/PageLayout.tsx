"use client";

import { ReactNode } from 'react';
import { useCurrentPage } from '@core/hooks/useCurrentPage';
import { PageProvider } from '@core/contexts/PageContext';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { pageInfo, apiBasePath } = useCurrentPage();

  return (
    <PageProvider apiBasePath={apiBasePath} pageInfo={pageInfo}>
      {children}
    </PageProvider>
  );
}