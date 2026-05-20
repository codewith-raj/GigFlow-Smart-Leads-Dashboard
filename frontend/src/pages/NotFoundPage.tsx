import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import Button from '@/components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-slate-950 p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/15 via-slate-950 to-slate-950"
        aria-hidden
      />
      <div className="relative z-10 max-w-md text-center">
        <BrandLogo size="md" className="mb-10 justify-center" />
        <p className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-7xl font-bold text-transparent">
          404
        </p>
        <h1 className="mt-4 text-xl font-semibold text-slate-200">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="primary"
            className="min-h-11 w-full touch-manipulation sm:w-auto"
            leftIcon={<Home className="h-4 w-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Go to dashboard
          </Button>
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="min-h-11 w-full touch-manipulation"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
