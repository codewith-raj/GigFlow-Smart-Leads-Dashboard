import { isAxiosError } from 'axios';

export const getApiErrorMessage = (err: unknown, fallback: string): string => {
  if (isAxiosError(err)) {
    if (!err.response) {
      return 'Cannot reach the server. Check your connection and API URL, then try again.';
    }
    const status = err.response.status;
    if (status === 405) {
      return 'API routing error (405). Set VITE_API_URL on Vercel to your Render backend URL ending with /api.';
    }
    if (status === 401 || status === 403) {
      const message = err.response.data?.message;
      if (typeof message === 'string') return message;
    }
    const message = err.response.data?.message;
    if (typeof message === 'string') return message;
    if (status >= 500) {
      return 'Server error. Please try again in a moment.';
    }
  }
  return fallback;
};
