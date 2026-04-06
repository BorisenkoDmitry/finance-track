import type { FC } from "react";
import { X } from "lucide-react";

interface IPopup {
  children: React.ReactNode;
  onClose: () => void;
  wide?: number;
  className?: string;
  height?: string | "auto";
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const Popup: FC<IPopup> = ({
  children,
  onClose,
  wide = 520,
  className,
  height,
  title,
  subtitle,
  icon,
}) => {
  return (
    <div
      className={[
        "fixed inset-0 z-[1001] flex items-center justify-center p-4",
        "bg-primary-800/60 backdrop-blur-sm animate-fade-in",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="relative flex max-h-[90dvh] w-full flex-col rounded-2xl border border-primary-700/20 bg-bg-menu/98 backdrop-blur-xl animate-scale-in overflow-hidden"
        style={{
          maxWidth: `${wide}px`,
          minHeight: height === "auto" ? "auto" : height,
        }}
      >
        {/* Header — sticky */}
        {(title || icon) && (
          <div className="flex shrink-0 items-center gap-3 border-b border-primary-700/15 px-6 py-4">
            {icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {title && <h3 className="text-sm font-semibold text-grey-0">{title}</h3>}
              {subtitle && <p className="mt-0.5 text-[11px] text-grey-200/50">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-grey-200/40 transition-colors hover:bg-primary-700/20 hover:text-grey-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Close if no header */}
        {!title && !icon && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-grey-200/40 transition-colors hover:bg-primary-700/20 hover:text-grey-0"
          >
            <X size={16} />
          </button>
        )}

        {/* Body — scrollable */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
