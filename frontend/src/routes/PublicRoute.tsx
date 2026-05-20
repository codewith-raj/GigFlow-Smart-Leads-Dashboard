import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/ui/Loader';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, isHydrated, isCheckingAuth } = useAuthStore();

  if (!isHydrated || isCheckingAuth) {
    return <Loader fullscreen text="Checking your session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
