import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import Button from '@/components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/15 via-slate-950 to-slate-950 pointer-events-none"
        aria-hidden
      />
      <div className="relative z-10 text-center max-w-md">
        <BrandLogo size="md" className="justify-center mb-10" />
        <p className="text-7xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="text-xl font-semibold text-slate-200 mt-4">Page not found</h1>
        <p className="text-slate-500 text-sm mt-2 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            leftIcon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Link to="/login">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
