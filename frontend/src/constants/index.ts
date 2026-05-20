export const APP_NAME = 'GigFlow';
export const APP_PRODUCT = 'Smart Leads Dashboard';
export const APP_FULL_NAME = 'GigFlow Smart Leads Dashboard';
export const PROJECT_SLUG = 'gigflow-smart-leads-dashboard';
export const LOGO_PATH = '/logo.png';
export const BRAND_COLOR = '#ef4444';
export const APP_TAGLINE =
  'Track, qualify, and convert leads with enterprise-grade filtering and team permissions.';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

if (import.meta.env.PROD && typeof window !== 'undefined') {
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';
  if (!isLocalHost && API_BASE_URL.startsWith('/')) {
    console.warn(
      '[GigFlow] VITE_API_URL is relative in production. Set it in Vercel to https://<your-render-app>.onrender.com/api'
    );
  }
}

export const ROLE_LABELS: Record<'admin' | 'sales', string> = {
  admin: 'Admin',
  sales: 'Sales User',
};

export const ROLE_DESCRIPTIONS: Record<'admin' | 'sales', string> = {
  admin: 'Full access — delete leads, export CSV, manage pipeline',
  sales: 'Create & update leads, view pipeline and lead details',
};

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'lost'] as const;
export const LEAD_SOURCES = ['website', 'instagram', 'referral'] as const;
export const SORT_OPTIONS = ['latest', 'oldest'] as const;

export const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  lost: 'Lost',
};

export const SOURCE_LABELS: Record<string, string> = {
  website: 'Website',
  instagram: 'Instagram',
  referral: 'Referral',
};

export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  qualified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  lost: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export const SOURCE_COLORS: Record<string, string> = {
  website: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  referral: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export const DEBOUNCE_DELAY = 500;
export const DEFAULT_PAGE_SIZE = 10;
