import { useLocation, matchPath } from 'react-router-dom';

export interface PageMeta {
  title: string;
  subtitle: string;
}

export const usePageMeta = (): PageMeta => {
  const { pathname } = useLocation();

  if (matchPath({ path: '/leads/:id', end: true }, pathname)) {
    return {
      title: 'Lead Details',
      subtitle: 'Complete profile and activity for this lead',
    };
  }

  if (matchPath({ path: '/profile', end: true }, pathname)) {
    return {
      title: 'My Profile',
      subtitle: 'Manage your account, security, and professional details',
    };
  }

  return {
    title: 'Lead Pipeline',
    subtitle: 'Monitor performance, filter leads, and manage your sales funnel',
  };
};
