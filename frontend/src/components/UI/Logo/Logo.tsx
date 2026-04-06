import type { FC } from "react";
import { Link } from "react-router-dom";

interface ILogo {
  href: string;
  compact?: boolean;
}

export const Logo: FC<ILogo> = ({ href, compact }) => {
  return (
    <Link to={href} className="flex items-center gap-3 group">
      {/* Icon */}
      <div className="relative shrink-0">
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6359e9" />
              <stop offset="100%" stopColor="#2BD2BE" />
            </linearGradient>
            <linearGradient id="logoGrad2" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c74ef" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2BD2BE" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Outer glow circle */}
          <circle cx="21" cy="21" r="20" fill="url(#logoGrad2)" stroke="url(#logoGrad)" strokeWidth="1.5" />

          {/* Inner circle */}
          <circle cx="21" cy="21" r="16" fill="#0b0a22" fillOpacity="0.85" />

          {/* F letter */}
          <path
            d="M12 13h7.5v2.2h-5v3.3h4.2v2.2h-4.2v5.8H12V13z"
            fill="url(#logoGrad)"
          />

          {/* T letter */}
          <path
            d="M21 13h9v2.2h-3.25v11.3h-2.5V15.2H21V13z"
            fill="#2BD2BE"
          />

          {/* Coin decoration - top right */}
          <circle cx="33" cy="9" r="4.5" fill="#2BD2BE" fillOpacity="0.9" />
          <circle cx="33" cy="9" r="3" fill="none" stroke="#0b0a22" strokeWidth="0.8" />
          <text x="33" y="10.5" textAnchor="middle" fill="#0b0a22" fontSize="5" fontWeight="bold" fontFamily="sans-serif">$</text>

          {/* Small coin behind */}
          <circle cx="29" cy="6" r="3" fill="#6359e9" fillOpacity="0.7" />
          <text x="29" y="7.5" textAnchor="middle" fill="#f5f6ff" fontSize="3.5" fontWeight="bold" fontFamily="sans-serif">$</text>

          {/* Chart line - bottom */}
          <path
            d="M10 33 L16 30 L22 32 L28 28 L34 26"
            stroke="#2BD2BE"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.6"
          />
          <circle cx="34" cy="26" r="1.5" fill="#2BD2BE" opacity="0.8" />
        </svg>
      </div>

      {/* Text */}
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-extrabold tracking-tight text-grey-0 transition-colors group-hover:text-primary-400">
            Finance
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary-500">
            Track
          </span>
        </div>
      )}
    </Link>
  );
};
