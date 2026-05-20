import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/contexts/SidebarContext';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="app-shell-bg flex h-[100dvh] max-h-[100dvh] overflow-hidden">
        <Sidebar />
        <div className="dashboard-main flex min-h-0 min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-out lg:ml-[var(--sidebar-width,16rem)]">
          <TopNavbar />
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain scroll-smooth">
            <div className="dashboard-page mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
