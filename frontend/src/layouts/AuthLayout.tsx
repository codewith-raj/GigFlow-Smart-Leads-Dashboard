import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthIllustration from '@/components/auth/AuthIllustration';
import BrandLogo from '@/components/brand/BrandLogo';
import type { AuthVariant } from '@/types/auth-layout';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
  variant: AuthVariant;
}

const PANEL_COPY: Record<
  AuthVariant,
  { headline: string; subline: string; tag: string }
> = {
  login: {
    headline: 'Welcome back to your pipeline',
    subline: 'Pick up where you left off — leads, filters, and insights in one place.',
    tag: 'Secure sign-in',
  },
  register: {
    headline: 'Start growing your lead pipeline',
    subline: 'Create your workspace in seconds and invite your team when you are ready.',
    tag: 'Free to get started',
  },
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
  variant,
}) => {
  const { pathname } = useLocation();
  const copy = PANEL_COPY[variant];
  const isRegister = variant === 'register';

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col overflow-x-hidden bg-slate-950 lg:flex-row">
      <aside
        className={`
          auth-panel-aside relative flex flex-col justify-between
          w-full lg:w-[42%] xl:w-[44%] min-h-[280px] sm:min-h-[340px] lg:min-h-screen
          px-6 sm:px-10 lg:px-12 py-8 lg:py-12 overflow-hidden
          ${isRegister
            ? 'auth-panel-register bg-gradient-to-br from-rose-950 via-red-900/90 to-orange-950'
            : 'auth-panel-login bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-900'}
        `}
      >
        <div
          className={`absolute inset-0 auth-orb-1 opacity-40 ${isRegister ? 'bg-[radial-gradient(circle_at_70%_30%,_rgba(251,113,133,0.35),_transparent_55%)]' : 'bg-[radial-gradient(circle_at_30%_20%,_rgba(56,189,248,0.2),_transparent_50%)]'}`}
          aria-hidden
        />
        <div
          className={`absolute bottom-0 ${isRegister ? 'left-0' : 'right-0'} w-72 h-72 rounded-full blur-3xl auth-orb-2 ${isRegister ? 'bg-rose-500/25' : 'bg-indigo-500/25'}`}
          aria-hidden
        />

        <div className="relative z-10 auth-slide-up">
          <BrandLogo size="md" showTagline />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-6 lg:py-10">
          <span
            className={`
              inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4
              auth-slide-up auth-slide-up-delay-1
              ${isRegister
                ? 'bg-rose-500/20 text-rose-100 border border-rose-400/30'
                : 'bg-sky-500/15 text-sky-100 border border-sky-400/25'}
            `}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isRegister ? 'bg-rose-400 auth-pulse-dot' : 'bg-sky-400 auth-pulse-dot'}`} />
            {copy.tag}
          </span>
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-sm auth-slide-up auth-slide-up-delay-1 ${isRegister ? 'auth-text-glow-register' : 'auth-text-glow-login'}`}
          >
            {copy.headline}
          </h2>
          <p className="mt-3 text-sm text-white/70 max-w-xs auth-slide-up auth-slide-up-delay-2">
            {copy.subline}
          </p>
          <div className="mt-6 lg:mt-10 auth-slide-up auth-slide-up-delay-3">
            <AuthIllustration variant={variant} />
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40 hidden sm:block auth-slide-up auth-slide-up-delay-4">
          GigFlow Smart Leads Dashboard
        </p>
      </aside>

      <main
        className={`
          flex flex-1 items-center justify-center px-4 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] pt-6 sm:px-8 sm:pt-10 lg:px-12 lg:py-12 xl:px-16
          ${isRegister ? 'bg-gradient-to-b from-slate-950 to-slate-900' : 'bg-slate-950'}
        `}
      >
        <div
          key={pathname}
          className={`w-full max-w-[440px] ${isRegister ? 'auth-enter-register' : 'auth-enter-login'}`}
        >
          <div className="lg:hidden flex justify-center mb-8 auth-scale-in">
            <BrandLogo size="sm" showTagline />
          </div>

          <div className="auth-slide-up mb-2">
            <h1
              className={`
                text-2xl sm:text-3xl font-bold tracking-tight
                ${isRegister ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-orange-100' : 'text-slate-50'}
              `}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-400 auth-slide-up auth-slide-up-delay-1">
                {subtitle}
              </p>
            )}
          </div>

          <div className="auth-form-stagger">{children}</div>

          <p className="text-center text-sm text-slate-400 mt-8 auth-slide-up auth-slide-up-delay-3">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className={`
                font-semibold transition-colors
                ${isRegister ? 'text-rose-400 hover:text-rose-300' : 'text-sky-400 hover:text-sky-300'}
              `}
            >
              {footerLinkText}
            </Link>
          </p>

          <p className="text-center text-[11px] text-slate-600 mt-6 lg:hidden">
            {isRegister ? 'Join GigFlow' : 'Welcome back to GigFlow'}
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
