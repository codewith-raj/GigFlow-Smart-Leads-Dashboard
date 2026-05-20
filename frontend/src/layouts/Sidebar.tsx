import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import BrandLogo from '@/components/brand/BrandLogo';
import { ROLE_LABELS } from '@/constants';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsMobileOpen(false);
    clearAuth();
    navigate('/login');
  };

  const closeMobile = () => setIsMobileOpen(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div
        className={`flex items-center gap-3 border-b border-slate-700/50 p-5 sm:p-6 ${isCollapsed ? 'justify-center px-4' : ''}`}
      >
        {isCollapsed ? (
          <BrandLogo size="sm" />
        ) : (
          <div className="min-w-0">
            <BrandLogo size="sm" showTagline />
            {user?.role && (
              <p className="mt-2 text-[11px] font-medium text-slate-500">
                {ROLE_LABELS[user.role]} workspace
              </p>
            )}
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3 sm:p-4" aria-label="Main navigation">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={closeMobile}
            className={({ isActive }) =>
              `group flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium touch-manipulation transition-all duration-200
              ${isActive
                ? 'border border-red-500/20 bg-red-600/20 text-red-400'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }
              ${isCollapsed ? 'justify-center' : ''}
              `
            }
            title={isCollapsed ? label : undefined}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{label}</span>}
            {!isCollapsed && (
              <ChevronRight className="ml-auto h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </NavLink>
        ))}
      </nav>

      <div
        className={`space-y-1 border-t border-slate-700/50 p-3 sm:p-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}
      >
        {user && !isCollapsed && (
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-800/40 px-3 py-2.5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-sm font-bold text-white">
              {user.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className={`flex min-h-[44px] w-full touch-manipulation items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden
          onClick={closeMobile}
          role="presentation"
        />
      )}

      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-[max(1rem,env(safe-area-inset-left,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] z-50 flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 shadow-lg transition-colors hover:text-slate-100 active:scale-95 lg:hidden"
        aria-expanded={isMobileOpen}
        aria-controls="mobile-sidebar"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={`
          relative sticky top-0 hidden h-screen flex-shrink-0 flex-col border-r border-slate-700/50 bg-slate-900/95 backdrop-blur-xl transition-all duration-300 lg:flex
          ${isCollapsed ? 'w-16' : 'w-64 xl:w-72'}
        `}
      >
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 shadow-md transition-colors hover:text-slate-100"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
        {sidebarContent}
      </aside>

      <aside
        id="mobile-sidebar"
        className={`
          fixed left-0 top-0 z-50 flex h-[100dvh] w-[min(18rem,calc(100vw-1.5rem))] flex-col border-r border-slate-700/50 bg-slate-900/98 backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
        aria-hidden={!isMobileOpen}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
