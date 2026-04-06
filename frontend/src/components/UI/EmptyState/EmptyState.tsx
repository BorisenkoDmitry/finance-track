import type { FC, ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title = "Пока пусто",
  subtitle,
  compact = false,
}) => {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center",
        compact ? "py-6" : "py-14",
        "animate-fade-in",
      ].join(" ")}
    >
      {/* Animated floating icon with flying banknotes */}
      <div className="relative mb-4">
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-primary-500/10 blur-2xl animate-pulse-soft" />

        {/* Flying banknotes */}
        <div className="absolute inset-[-16px] animate-[spin_10s_linear_infinite]">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 text-[11px] opacity-50 drop-shadow-[0_0_4px_rgba(255,117,130,0.4)]">
            💵
          </span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] opacity-40 drop-shadow-[0_0_4px_rgba(53,92,125,0.4)]">
            💴
          </span>
        </div>
        <div className="absolute inset-[-12px] animate-[spin_14s_linear_infinite_reverse]">
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] opacity-45 drop-shadow-[0_0_4px_rgba(197,108,134,0.4)]">
            💶
          </span>
        </div>
        <div className="absolute inset-[-20px] animate-[spin_18s_linear_infinite]">
          <span className="absolute left-0 top-1/3 text-[8px] opacity-35">
            💷
          </span>
        </div>

        {/* Icon container with float */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-700/30 bg-primary-900/40 text-grey-200/40 animate-[float_3s_ease-in-out_infinite] backdrop-blur-sm">
          {icon ?? <DefaultIcon />}
        </div>
      </div>

      {/* Text */}
      <p
        className={[
          "font-medium text-grey-200/40 animate-fade-in-up",
          compact ? "text-xs" : "text-sm",
        ].join(" ")}
      >
        {title}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-grey-200/25 animate-fade-in-up"
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

const DefaultIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
