import React from 'react';
import AuthGoogleButton from '@/components/auth/AuthGoogleButton';
import type { UserRole } from '@/types';

interface AuthSocialButtonsProps {
  mode: 'login' | 'register';
  role?: UserRole;
}

const AuthSocialButtons: React.FC<AuthSocialButtonsProps> = ({ mode, role }) => {
  return (
    <div className="auth-slide-up auth-slide-up-delay-4">
      <AuthGoogleButton mode={mode} role={role} variant={mode} />
    </div>
  );
};

export default AuthSocialButtons;
