import { create } from 'zustand';

export interface AuthState {
  token: string | null;
  user: any | null;
  permissions: any[];
}

interface AuthStore {
  auth: AuthState;
  isLoaded: boolean;

  login: (data: any) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  auth: {
    token: null,
    user: null,
    permissions: [],
  },
  isLoaded: false,

  // 🔥 INITIAL LOAD (from localStorage)
  loadFromStorage: () => {
    const storedAuth = localStorage.getItem('auth');

    if (storedAuth) {
      set({
        auth: JSON.parse(storedAuth),
      });
    }

    set({ isLoaded: true });
  },

  // 🔐 LOGIN
  login: (data) => {
    const newAuth: AuthState = {
      token: data.access_token,
      user: data.user,
      permissions: data.permissions || [],
    };

    localStorage.setItem('auth', JSON.stringify(newAuth));

    set({
      auth: newAuth,
    });
  },

  // 🚪 LOGOUT
  logout: () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('menu');

    set({
      auth: { token: null, user: null, permissions: [] },
    });
  },
}));