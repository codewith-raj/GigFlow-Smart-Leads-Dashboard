import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const AuthFormTabs: React.FC = () => {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login';

  return (
    <div className="flex p-1 rounded-xl bg-slate-800/80 border border-slate-700/50 mb-8">
      <Link
        to="/login"
        className={`
          flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
          ${
            isLogin
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }
        `}
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Link>
      <Link
        to="/register"
        className={`
          flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
          ${
            !isLogin
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }
        `}
      >
        <UserPlus className="w-4 h-4" />
        Sign Up
      </Link>
    </div>
  );
};

export default AuthFormTabs;
