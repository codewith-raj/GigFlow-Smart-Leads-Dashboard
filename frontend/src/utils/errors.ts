import { isAxiosError } from 'axios';

export const getApiErrorMessage = (err: unknown, fallback: string): string => {
  if (isAxiosError(err)) {
    if (!err.response) {
      return 'Cannot reach the server. Start the backend (port 5000) and refresh the page.';
    }
    const message = err.response.data?.message;
    if (typeof message === 'string') return message;
  }
  return fallback;
};
