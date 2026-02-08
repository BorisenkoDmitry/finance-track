import { memo, type FC } from "react";
import { DateRangeField } from "../../UI/DateField/DateRangeField";

type DateOptions = {
  isMonth: boolean;
  isYear: boolean;
  isDay?: boolean;
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
    const rootClasses = [
      "flex items-start justify-between",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div
        className={rootClasses}
        onClick={() => {
          //  console.log(new Date(start));
          //  console.log(new Date(end))
        }}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px] tracking-[-0.02em] text-primary-500">
            {title} test {title}
          </h1>
          {subtitle && (
            <div className="text-xs">{subtitle}</div>
          )}
        </div>
        {dateOn && (
          <div className="ml-auto mr-5">
            <DateRangeField
              options={dateOn}
              isHideDateControlls={isHideDateControlls}
            />
          </div>
        )}
        <div>{children}</div>
      </div>
    );
  }
);
