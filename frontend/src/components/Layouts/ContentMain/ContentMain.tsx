import type { FC } from "react";

interface IContentMain {
  children?: React.ReactNode;
  className?: string;
}

export const ContentMain: FC<IContentMain> = ({
  children,
  className,
}) => {
  return (
    <div className={["custom-scrollbar overflow-y-auto pb-20 lg:pb-0 animate-fade-in", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
};
