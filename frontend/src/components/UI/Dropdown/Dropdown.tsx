import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

export type DropdownOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  placeholder?: string;
  className?: string;
}

export const Dropdown: FC<DropdownProps> = ({
  options,
  value,
  onChange,
  icon,
  placeholder = "Выберите...",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={["relative", className].filter(Boolean).join(" ")}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 whitespace-nowrap",
          isOpen
            ? "border-primary-500/60 bg-primary-900/50 shadow-glow-sm text-grey-0"
            : "border-primary-700/40 bg-primary-900/35 text-grey-100 hover:border-primary-600/50",
        ].join(" ")}
      >
        {icon && <span className="text-grey-200/40">{icon}</span>}
        <span className={selected ? "text-grey-0" : "text-grey-200/50"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={13}
          className={[
            "ml-auto shrink-0 text-grey-200/40 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-full animate-fade-in-down">
          <div className="rounded-xl border border-primary-700/30 bg-bg-menu/98 backdrop-blur-xl shadow-card overflow-hidden">
            <div className="custom-scrollbar max-h-[280px] overflow-y-auto py-1">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={[
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-all duration-150",
                      isSelected
                        ? "bg-primary-500/15 text-primary-400"
                        : "text-grey-200/80 hover:bg-primary-700/20 hover:text-grey-0",
                    ].join(" ")}
                  >
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="flex-1">{opt.label}</span>
                    {isSelected && (
                      <Check size={14} className="shrink-0 text-primary-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
