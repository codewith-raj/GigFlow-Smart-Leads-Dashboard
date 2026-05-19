import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/utils/errors';
import { isGoogleAuthConfigured } from '@/constants/google';
import type { UserRole } from '@/types';

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface AuthGoogleButtonProps {
  mode: 'login' | 'register';
  role?: UserRole;
  variant?: 'login' | 'register';
}

const AuthGoogleButton: React.FC<AuthGoogleButtonProps> = ({
  mode,
  role = 'sales',
  variant = mode,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const label = mode === 'register' ? 'Sign up with Google' : 'Sign in with Google';

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error('Google did not return a credential. Try again.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.googleAuth({
        credential: response.credential,
        ...(mode === 'register' ? { role } : {}),
      });
      if (res.data) {
        setAuth(res.data.user, res.data.token);
        const greeting = res.data.isNewUser ? 'Welcome aboard' : 'Welcome back';
        toast.success(`${greeting}, ${res.data.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Google sign-in failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isGoogleAuthConfigured) {
    return (
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-slate-600 text-slate-500 text-sm cursor-not-allowed"
        title="Add VITE_GOOGLE_CLIENT_ID to frontend/.env"
      >
        <GoogleIcon />
        Google sign-in (configure client ID)
      </button>
    );
  }

  const shellClass =
    variant === 'register'
      ? 'auth-google-shell-register'
      : 'auth-google-shell-login';

  return (
    <div className={`relative w-full ${shellClass}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-900/80 backdrop-blur-sm">
          <span className="text-sm text-slate-300 animate-pulse">Connecting to Google…</span>
        </div>
      )}

      <div
        className={`
          flex items-center justify-center min-h-[48px] rounded-xl border transition-all duration-300
          ${variant === 'register'
            ? 'border-rose-500/40 bg-rose-950/30 hover:border-rose-400/60 hover:bg-rose-950/50 auth-google-glow-register'
            : 'border-sky-500/30 bg-sky-950/20 hover:border-sky-400/50 hover:bg-sky-950/40 auth-google-glow-login'}
          ${loading ? 'opacity-60 pointer-events-none' : ''}
        `}
      >
        <div className="auth-google-btn-inner flex justify-center w-full py-0.5">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error('Google sign-in was cancelled or failed')}
            theme="filled_black"
            size="large"
            text={mode === 'register' ? 'signup_with' : 'signin_with'}
            shape="rectangular"
            width="360"
          />
        </div>
      </div>

      <p className="sr-only">{label}</p>
    </div>
  );
};

export default AuthGoogleButton;
