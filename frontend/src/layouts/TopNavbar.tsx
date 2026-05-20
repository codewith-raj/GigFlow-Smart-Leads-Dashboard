import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import UserAvatar from '@/components/profile/UserAvatar';
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
    <header className="sticky top-0 z-20 flex-shrink-0 border-b border-slate-800/60 bg-slate-950/90 shadow-[0_1px_0_oklch(1_0_0/0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/80 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
      <div className="app-safe-x flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-4">
        <div className="min-w-0 pl-11 lg:pl-3 xl:pl-4">
          <h1 className="truncate text-lg font-bold tracking-tight text-slate-100 sm:text-xl lg:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">{subtitle}</p>
        </div>

        <div className="flex flex-shrink-0 items-center justify-end gap-2 sm:gap-3">
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800 text-slate-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {roleLabel && (
            <span className="hidden items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 sm:inline-flex">
              {roleLabel}
            </span>
          )}

          <Link
            to="/profile"
            className="flex-shrink-0 rounded-full ring-2 ring-transparent transition hover:ring-red-500/40 focus-visible:outline-none focus-visible:ring-red-500/50"
            title="My profile"
            aria-label="Open my profile"
          >
            <UserAvatar user={user} size="sm" showStatus />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
