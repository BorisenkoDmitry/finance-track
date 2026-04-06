import type { FC, ReactNode } from "react";

interface FloatingActionProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  gradient?: string;
}

export const FloatingAction: FC<FloatingActionProps> = ({
  onClick,
  icon,
  label,
  gradient = "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)",
}) => (
  <button
    onClick={onClick}
    className="fixed bottom-[68px] left-4 right-4 z-40 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-grey-0 shadow-glow-md transition-all duration-200 active:scale-[0.98] lg:hidden"
    style={{ background: gradient }}
  >
    {icon}
    {label}
  </button>
);
