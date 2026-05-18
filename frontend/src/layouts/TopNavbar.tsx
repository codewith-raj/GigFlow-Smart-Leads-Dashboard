import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ROLE_LABELS } from '@/constants';

const TopNavbar: React.FC = () => {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { title, subtitle } = usePageMeta();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const roleLabel = user?.role ? ROLE_LABELS[user.role] : '';

  return (
    <header className="sticky top-0 z-30 bg-slate-900/85 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="lg:ml-0 ml-12 min-w-0">
          <h1 className="text-xl font-bold text-slate-100 truncate">{title}</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-200"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {roleLabel && (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              {roleLabel}
            </span>
          )}

          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-bold shadow-md"
            title={user?.name}
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
