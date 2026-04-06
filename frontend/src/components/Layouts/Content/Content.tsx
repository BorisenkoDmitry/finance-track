import type { FC } from "react";

interface IContent {
    children: React.ReactNode;
    className?: string;
}

export const Content: FC<IContent> = ({children, className}) => {
    const classes = [
        "relative flex-1 overflow-hidden custom-scrollbar overflow-y-auto",
        "flex flex-col gap-3 px-4 pt-0 pb-28",
        "lg:grid lg:grid-rows-[auto_1fr] lg:gap-[40px] lg:py-6 lg:px-[50px] lg:pb-6",
        className,
    ].filter(Boolean).join(" ");

    return (<div className={classes}>{children}</div>);
}
