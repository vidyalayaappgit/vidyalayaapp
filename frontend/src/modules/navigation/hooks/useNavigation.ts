import { useCallback } from 'react';

import { useNavigationStore } from '@store/navigation.store';
import { useAuthStore } from '@store/auth.store';

import { getNavigation } from '@modules/navigation/services/navigation.service';

export function useNavigation() {
  const token = useAuthStore((state) => state.auth.token);
  const setMenu = useNavigationStore((state) => state.setMenu);

  const loadNavigation = useCallback(async (): Promise<void> => {
    if (!token) return;

    try {
      const data = await getNavigation(); // ✅ Module[]

      setMenu(data); // ✅ type-safe

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('❌ Navigation load failed:', error.message);
      } else {
        console.error('❌ Unknown error while loading navigation');
      }
    }
  }, [token, setMenu]);

  return {
    loadNavigation,
  };
}