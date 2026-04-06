import { memo, type FC } from "react";
import { DateRangeField } from "../../UI/DateField/DateRangeField";
import { Logo } from "../../UI/Logo/Logo";

type DateOptions = {
  isMonth: boolean;
  isYear: boolean;
};

interface IContentHeader {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  dateOn?: DateOptions;
  isHideDateControlls?: boolean;
}

export const ContentHeader: FC<IContentHeader> = memo(
  ({
    title,
    subtitle,
    children,
    className,
    dateOn,
    isHideDateControlls = false,
  }) => {
    return (
      <div
        className={[
          "animate-fade-in-down",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ─── Mobile layout ─── */}
        <div className="flex flex-col gap-3 lg:hidden">
          {/* Top bar: logo + title */}
          <div className="-mx-4 flex items-center gap-3 border-b border-primary-700/15 bg-bg-menu/60 px-4 py-3 backdrop-blur-md">
            <Logo href="/" compact />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold text-grey-0">{title}</h1>
            </div>
          </div>
          {/* Date + toolbar */}
          <div className="flex items-center gap-2">
            {dateOn && (
              <DateRangeField
                options={dateOn}
                isHideDateControlls={isHideDateControlls}
              />
            )}
            <div className="ml-auto flex items-center gap-1">
              {children}
            </div>
          </div>
        </div>

        {/* ─── Desktop layout ─── */}
        <div className="hidden lg:flex lg:flex-col lg:gap-2">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-[30px] font-bold tracking-tight text-grey-0">
              <span className="text-gradient">{title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {dateOn && (
                <DateRangeField
                  options={dateOn}
                  isHideDateControlls={isHideDateControlls}
                />
              )}
              {children}
            </div>
          </div>
          {subtitle && (
            <div className="text-sm text-grey-200/70">{subtitle}</div>
          )}
        </div>
      </div>
    );
  }
);
