import { create } from 'zustand';
import type {
  Module,
} from '@modules/navigation/types/navigation.types';

interface NavigationStore {
  menu: Module[];

  setMenu: (menu: Module[]) => void;
  loadFromStorage: () => void;
  clearMenu: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  menu: [],

  // 🔥 Load menu from localStorage (fast UI)
  loadFromStorage: () => {
    try {
      const storedMenu = localStorage.getItem('menu');

      if (!storedMenu) return;

      const parsed: Module[] = JSON.parse(storedMenu);

      set({
        menu: parsed,
      });
    } catch (error: unknown) {
      console.error('❌ Failed to parse stored menu:', error);
    }
  },

  // 🔥 Set menu (after API call)
  setMenu: (menu: Module[]) => {
    try {
      localStorage.setItem('menu', JSON.stringify(menu));

      set({
        menu: [...menu], // 🔥 ensures re-render
      });
    } catch (error: unknown) {
      console.error('❌ Failed to save menu:', error);
    }
  },

  // 🔥 Clear menu (logout)
  clearMenu: () => {
    try {
      localStorage.removeItem('menu');

      set({
        menu: [],
      });
    } catch (error: unknown) {
      console.error('❌ Failed to clear menu:', error);
    }
  },
}));