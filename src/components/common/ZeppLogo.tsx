import React, { useState } from 'react';
import { ZEPP_OFFICIAL_LOGO_URL } from '../../utils/media';

interface ZeppLogoProps {
  variant?: 'full' | 'symbol' | 'loading';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ZeppLogo: React.FC<ZeppLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    full: {
      sm: 'w-12 h-12 rounded-2xl',
      md: 'w-20 h-20 rounded-[22px]',
      lg: 'w-24 h-24 rounded-[26px]',
      xl: 'w-28 h-28 rounded-[30px]',
    },
    symbol: {
      sm: 'w-9 h-9 rounded-xl',
      md: 'w-11 h-11 rounded-2xl',
      lg: 'w-14 h-14 rounded-2xl',
      xl: 'w-16 h-16 rounded-2xl',
    },
    loading: {
      sm: 'w-10 h-10 rounded-xl',
      md: 'w-14 h-14 rounded-2xl',
      lg: 'w-16 h-16 rounded-2xl',
      xl: 'w-20 h-20 rounded-2xl',
    },
  };

  if (imgError) {
    return (
      <div
        className={`flex items-center justify-center bg-[#EDF4FF] dark:bg-[#142443] border border-[#1769E8]/30 text-[11px] font-medium text-[#142443] dark:text-[#DCEAFF] text-center p-2 ${sizeMap[variant][size]} ${className}`}
        role="img"
        aria-label="Official Zepp logo asset unavailable"
      >
        Zepp logo asset missing
      </div>
    );
  }

  if (variant === 'symbol') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 shadow-sm border border-white/80 dark:border-blue-300/20 bg-[#EDF4FF] ${sizeMap.symbol[size]} ${className}`}
      >
        <img
          src={ZEPP_OFFICIAL_LOGO_URL}
          alt="Zepp bird symbol"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-[50%_38%] scale-[1.62] select-none"
        />
      </div>
    );
  }

  if (variant === 'loading') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 shadow-md border border-white/85 dark:border-blue-300/20 bg-[#EDF4FF] ${sizeMap.loading[size]} ${className}`}
      >
        <img
          src={ZEPP_OFFICIAL_LOGO_URL}
          alt="Zepp"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain select-none"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden shrink-0 shadow-[0_14px_34px_-8px_rgba(23,105,232,0.28)] border border-white/90 dark:border-blue-300/25 bg-[#EDF4FF] ${sizeMap.full[size]} ${className}`}
    >
      <img
        src={ZEPP_OFFICIAL_LOGO_URL}
        alt="Official Zepp Logo"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-center scale-[1.22] select-none"
      />
    </div>
  );
};
