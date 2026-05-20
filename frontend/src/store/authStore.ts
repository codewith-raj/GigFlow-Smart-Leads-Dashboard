import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user: User, token: string) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      clearAuth: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHydrated: (value: boolean) => set({ isHydrated: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
