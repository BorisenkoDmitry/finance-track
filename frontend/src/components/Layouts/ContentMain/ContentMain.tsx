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
    <div className={["app-scroll overflow-y-auto", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
};
