import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/ui/Loader';

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return <Loader fullscreen text="Restoring your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
