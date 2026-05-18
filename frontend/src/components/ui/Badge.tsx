import React from 'react';

interface BadgeProps {
  label: string;
  colorClass: string;
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ label, colorClass, size = 'md' }) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        border rounded-full font-medium capitalize tracking-wide
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'}
        ${colorClass}
      `}
    >
      {label}
    </span>
  );
};

export default Badge;
