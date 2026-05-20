import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  Users,
  Shield,
  UserCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/contexts/SidebarContext';
import BrandLogo from '@/components/brand/BrandLogo';
import { ROLE_LABELS } from '@/constants';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  description?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Pipeline & analytics',
  },
  {
    label: 'My Profile',
    path: '/profile',
    icon: UserCircle,
    description: 'Account & security',
  },
];

const Sidebar: React.FC = () => {
  const { isCollapsed, toggleCollapsed, isMobileOpen, setMobileOpen } = useSidebar();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setMobileOpen(false);
    clearAuth();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'U';

  const roleLabel = user?.role ? ROLE_LABELS[user.role] : '';

  const sidebarInner = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={`flex-shrink-0 border-b border-slate-800/80 px-4 py-5 ${isCollapsed ? 'flex justify-center px-3' : ''}`}
      >
        {isCollapsed ? (
          <BrandLogo size="sm" iconOnly />
        ) : (
          <div className="min-w-0">
            <BrandLogo size="sm" showTagline />
            {roleLabel && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/50 px-2.5 py-1">
                <Shield className="h-3 w-3 text-red-400/80" />
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {roleLabel}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4" aria-label="Main navigation">
        {!isCollapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
            Workspace
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map(({ label, path, icon: Icon, description }) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={closeMobile}
                title={isCollapsed ? label : undefined}
                className={({ isActive }) =>
                  `group relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 touch-manipulation
                  ${isActive
                    ? 'bg-gradient-to-r from-red-600/20 to-red-600/5 text-red-300 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.2)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }
                  ${isCollapsed ? 'justify-center px-2' : ''}
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-red-500"
                        aria-hidden
                      />
                    )}
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-slate-800/60 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-300'
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    {!isCollapsed && (
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{label}</span>
                        {description && (
                          <span className="mt-0.5 block truncate text-[11px] font-normal text-slate-500 group-hover:text-slate-400">
                            {description}
                          </span>
                        )}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {!isCollapsed && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-700/40 bg-slate-800/20 px-3 py-3">
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
              <p className="text-[11px] leading-relaxed text-slate-500">
                Manage leads, filter your pipeline, and export reports from the dashboard.
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* User + logout */}
      <div
        className={`flex-shrink-0 border-t border-slate-800/80 p-3 ${isCollapsed ? 'flex flex-col items-center gap-2' : 'space-y-2'}`}
      >
        {user && !isCollapsed && (
          <NavLink
            to="/profile"
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl border p-3 transition-all touch-manipulation ${
                isActive
                  ? 'border-red-500/30 bg-red-600/10'
                  : 'border-slate-700/40 bg-slate-800/40 hover:border-slate-600/50 hover:bg-slate-800/70'
              }`
            }
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-xs font-bold text-white shadow-lg shadow-red-900/30 ring-2 ring-slate-900/80">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                initials
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" title="Active" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-slate-100">{user.name}</p>
              <p className="truncate text-[11px] text-slate-500">{user.email}</p>
              <p className="mt-0.5 text-[10px] font-medium text-red-400/90">View profile →</p>
            </div>
          </NavLink>
        )}

        {user && isCollapsed && (
          <NavLink
            to="/profile"
            onClick={closeMobile}
            title={user.name}
            className={({ isActive }) =>
              `flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-xs font-bold text-white transition ring-2 ${
                isActive ? 'ring-red-400/50' : 'ring-transparent hover:ring-slate-600'
              }`
            }
          >
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </NavLink>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={`flex min-h-[44px] w-full touch-manipulation items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 ${isCollapsed ? 'w-auto justify-center px-2' : ''}`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>

        <button
          type="button"
          onClick={toggleCollapsed}
          className={`hidden min-h-[40px] w-full items-center justify-center gap-2 rounded-lg text-xs text-slate-500 transition-colors hover:bg-slate-800/60 hover:text-slate-300 lg:flex ${isCollapsed ? 'px-2' : 'px-3'}`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          aria-hidden
          onClick={closeMobile}
          role="presentation"
        />
      )}

      <button
        type="button"
        onClick={() => setMobileOpen(!isMobileOpen)}
        className="fixed left-[max(1rem,env(safe-area-inset-left,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] z-50 flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/95 text-slate-300 shadow-xl transition-colors hover:border-slate-600 hover:text-white active:scale-95 lg:hidden"
        aria-expanded={isMobileOpen}
        aria-controls="mobile-sidebar"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Desktop: fixed sidebar */}
      <aside
        className={`sidebar-fixed hidden h-[100dvh] flex-col border-r border-slate-800/90 bg-slate-950/98 shadow-[4px_0_24px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-[width] duration-300 ease-out lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex ${
          isCollapsed ? 'lg:w-[4.5rem]' : 'lg:w-64 xl:w-[17rem]'
        }`}
        aria-label="Application sidebar"
      >
        {sidebarInner}
      </aside>

      {/* Mobile drawer */}
      <aside
        id="mobile-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[min(18rem,calc(100vw-1.5rem))] flex-col border-r border-slate-800/90 bg-slate-950/98 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileOpen}
      >
        {sidebarInner}
      </aside>
    </>
  );
};

export default Sidebar;
