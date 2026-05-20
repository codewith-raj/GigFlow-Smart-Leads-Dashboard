import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { GOOGLE_CLIENT_ID, isGoogleAuthConfigured } from '@/constants/google';
import ProtectedRoute from '@/routes/ProtectedRoute';
import PublicRoute from '@/routes/PublicRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import LeadDetailsPage from '@/pages/LeadDetailsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Loader from '@/components/ui/Loader';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthBootstrap: React.FC = () => {
  const { token, user, isAuthenticated, isHydrated, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!token) {
      if (isAuthenticated || user) clearAuth();
      return;
    }

    if (user && isAuthenticated) return;

    let active = true;
    authApi
      .getMe()
      .then((res) => {
        if (!active || !res.data) return;
        setAuth(res.data.user, token);
      })
      .catch(() => {
        if (!active) return;
        clearAuth();
      });

    return () => {
      active = false;
    };
  }, [token, user, isAuthenticated, isHydrated, setAuth, clearAuth]);

  return null;
};

const AppShell: React.FC = () => (
  <BrowserRouter>
    <AuthBootstrap />
    <Suspense fallback={<Loader fullscreen />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads/:id" element={<LeadDetailsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

const App: React.FC = () => {
  const content = (
    <QueryClientProvider client={queryClient}>
      <AppShell />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </QueryClientProvider>
  );

  if (!isGoogleAuthConfigured) {
    return content;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {content}
    </GoogleOAuthProvider>
  );
};

export default App;
