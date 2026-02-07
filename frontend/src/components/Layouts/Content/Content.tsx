import type { FC } from "react";

interface IContent {
    children: React.ReactNode;
    className?: string;
}

export const Content: FC<IContent> = ({children, className}) => {
    const classes = [
        "relative flex-1 overflow-hidden grid grid-rows-[104px_1fr] gap-[60px] py-6 px-[60px]",
        className,
    ].filter(Boolean).join(" ");

    return (<div className={classes}>{children}</div>)
}