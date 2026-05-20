import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const SIDEBAR_EXPANDED = '16rem';
const SIDEBAR_COLLAPSED = '4.5rem';

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
  sidebarWidth: string;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    return () => {
      document.documentElement.style.removeProperty('--sidebar-width');
    };
  }, [sidebarWidth]);

  const toggleCollapsed = useCallback(() => setIsCollapsed((c) => !c), []);
  const setCollapsed = useCallback((value: boolean) => setIsCollapsed(value), []);

  const value = useMemo(
    () => ({
      isCollapsed,
      toggleCollapsed,
      setCollapsed,
      sidebarWidth,
      isMobileOpen,
      setMobileOpen,
    }),
    [isCollapsed, toggleCollapsed, setCollapsed, sidebarWidth, isMobileOpen]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return ctx;
}
