import React from 'react';
import { APP_NAME, APP_PRODUCT, APP_FULL_NAME, LOGO_PATH } from '@/constants';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  iconOnly?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { img: 'w-9 h-9', title: 'text-sm', tagline: 'text-[10px]' },
  md: { img: 'w-11 h-11', title: 'text-base', tagline: 'text-xs' },
  lg: { img: 'w-14 h-14', title: 'text-lg', tagline: 'text-xs' },
  xl: { img: 'w-20 h-20', title: 'text-xl', tagline: 'text-sm' },
};

const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  iconOnly = false,
  className = '',
}) => {
  const s = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={LOGO_PATH}
        alt={`${APP_FULL_NAME} logo`}
        className={`${s.img} object-contain flex-shrink-0 rounded-lg`}
        width={80}
        height={80}
        decoding="async"
      />
      {!iconOnly && (
        <div className="min-w-0">
          <p className={`${s.title} font-bold text-slate-100 tracking-tight`}>{APP_NAME}</p>
          {showTagline && (
            <p className={`${s.tagline} text-slate-500 truncate`}>{APP_PRODUCT}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
