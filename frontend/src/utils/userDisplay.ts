import type { User } from '@/types';

export function getUserInitials(name?: string): string {
  if (!name?.trim()) return 'U';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatMemberSince(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatLastUpdated(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Local email/password accounts can change password */
export function canChangePassword(user: User | null): boolean {
  if (!user) return false;
  return user.authProvider !== 'google';
}

export function profileCompletionPercent(user: User | null): number {
  if (!user) return 0;
  const fields = [
    user.name,
    user.email,
    user.phone,
    user.jobTitle,
    user.company,
    user.location,
    user.bio,
  ];
  const filled = fields.filter((f) => f && String(f).trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}
