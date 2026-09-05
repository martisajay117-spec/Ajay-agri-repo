import React from 'react';

interface AgriNLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const AgriNLogo: React.FC<AgriNLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-[#144723]',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-[28px]',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* 3-leaf sprout SVG matching the AgriN brand in screenshot */}
      <svg
        className={iconSizes[size]}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-center leaf */}
        <path
          d="M24 4C24 4 17 15 17 23C17 26.8 20.1 30 24 30C27.9 30 31 26.8 31 23C31 15 24 4 24 4Z"
          fill="#1b7a37"
        />
        {/* Left leaf */}
        <path
          d="M21.5 26.5C18 24.5 9 22 5 29C2.5 33.5 4.5 38.5 8.5 41C12.5 43.5 18 41 21.5 35C23 32.5 23 29 21.5 26.5Z"
          fill="#22c55e"
        />
        {/* Right leaf */}
        <path
          d="M26.5 26.5C30 24.5 39 22 43 29C45.5 33.5 43.5 38.5 39.5 41C35.5 43.5 30 41 26.5 35C25 32.5 25 29 26.5 26.5Z"
          fill="#16a34a"
        />
        {/* Stem connection */}
        <path
          d="M24 30V44"
          stroke="#15803d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <span className={`font-bold tracking-tight ${textColor} ${textSizes[size]}`}>
          Agri<span className="text-[#1b7a37]">N</span>
        </span>
      )}
    </div>
  );
};

