import React from 'react';
import { Shield, Filter, FileDown, Moon } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import { APP_TAGLINE } from '@/constants';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const highlights = [
  { icon: Shield, label: 'JWT auth & role-based access (Admin / Sales)' },
  { icon: Filter, label: 'Advanced filters, debounced search & pagination' },
  { icon: FileDown, label: 'CSV export with filter-aware data' },
  { icon: Moon, label: 'Dark & light mode for comfortable workflows' },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-red-900/15 via-slate-950 to-slate-950 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-600/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      />

      <aside className="hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col justify-between p-12 border-r border-slate-800/80 relative z-10">
        <BrandLogo size="xl" showTagline />
        <div className="space-y-8 max-w-md">
          <div>
            <h2 className="text-3xl xl:text-4xl font-bold text-slate-100 leading-tight tracking-tight">
              Lead management built for modern sales teams
            </h2>
            <p className="text-slate-400 mt-4 text-base leading-relaxed">{APP_TAGLINE}</p>
          </div>
          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-red-400" />
                </span>
                <span className="pt-2">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-600">
          MERN stack · TypeScript · MongoDB · Production-ready architecture
        </p>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <BrandLogo size="md" showTagline />
          </div>
          <div className="mb-8 lg:hidden text-center">
            <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
          </div>
          <div className="panel-elevated rounded-3xl p-8 sm:p-10">
            <div className="hidden lg:block mb-8">
              <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
