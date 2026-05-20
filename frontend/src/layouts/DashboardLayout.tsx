import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-[100dvh] min-h-screen app-shell-bg overflow-x-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar />
        <main className="app-safe-x flex-1 app-safe-b">
          <div className="dashboard-page mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
