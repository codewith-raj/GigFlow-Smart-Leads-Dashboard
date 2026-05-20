import React from 'react';
import type { User } from '@/types';
import { getUserInitials } from '@/utils/userDisplay';

interface UserAvatarProps {
  user: User | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
  xl: 'h-24 w-24 text-2xl sm:h-28 sm:w-28 sm:text-3xl',
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showStatus = false,
  className = '',
}) => {
  const initials = getUserInitials(user?.name);
  const s = sizeClasses[size];

  if (user?.avatar) {
    return (
      <div className={`relative inline-flex shrink-0 ${className}`}>
        <img
          src={user.avatar}
          alt={user.name}
          className={`${s} rounded-full object-cover ring-2 ring-slate-800`}
        />
        {showStatus && (
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500"
            title="Active"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${s} flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 font-bold text-white shadow-lg shadow-red-900/25 ring-2 ring-slate-800/80`}
      >
        {initials}
      </div>
      {showStatus && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500"
          title="Active"
        />
      )}
    </div>
  );
};

export default UserAvatar;
