import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ZeppMediaProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ZeppMedia: React.FC<ZeppMediaProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#DCEAFF] to-[#EDF4FF] dark:from-[#142443] dark:to-[#0D1930] text-[#142443] dark:text-[#DCEAFF] p-6 text-center ${className}`}
      >
        <ImageOff className="w-6 h-6 text-[#1769E8] dark:text-[#60A5FA]" />
        <span className="text-xs font-medium opacity-80">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
