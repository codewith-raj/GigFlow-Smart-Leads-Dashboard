import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,

      toggleTheme: () =>
        set((state) => {
          const next = !state.isDark;
          // Apply/remove 'light' class immediately on toggle
          if (next) {
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.add('light');
          }
          return { isDark: next };
        }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
