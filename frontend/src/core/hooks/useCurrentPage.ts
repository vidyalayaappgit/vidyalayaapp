import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useNavigationStore } from '@store/navigation.store';

export const useCurrentPage = () => {
  const pathname = usePathname();
  const menu = useNavigationStore((state) => state.menu);

  const pageInfo = useMemo(() => {
    if (!menu || menu.length === 0) return null;

    for (const module of menu) {
      for (const submodule of module.submodules) {
        const page = submodule.pages?.find((p) => p.route === pathname);
        if (page) {
          return {
            page_id: page.page_id,
            page_name: page.page_name,
            page_code: page.page_code,
            module_code: module.module_code,
            sub_module_code: submodule.sub_module_code,
            route: page.route,
          };
        }
      }
    }
    return null;
  }, [menu, pathname]);

  const apiBasePath = useMemo(() => {
    if (!pageInfo) return null;

    const modulePath = pageInfo.module_code.replace(/_/g, '-');
    const subModulePath = pageInfo.sub_module_code.replace(/_/g, '-');
    const pagePath = pageInfo.page_code.replace(/_/g, '-');
    const apiRoot = (process.env.NEXT_PUBLIC_API_URL ?? '/api').replace(/\/$/, '');

    return `${apiRoot}/${modulePath}/${subModulePath}/${pagePath}`;
  }, [pageInfo]);

  return { pageInfo, apiBasePath };
};
