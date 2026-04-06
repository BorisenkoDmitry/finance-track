import type { ButtonHTMLAttributes, FC } from "react";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "m" | "s" | "xl";
  theme?: "light-green" | "green" | "grey" | "black" | "red";
}

export const Button: FC<IButton> = ({
  size = "m",
  theme = "green",
  className,
  ...props
}) => {
  const sizeClasses =
    size === "s"
      ? "px-3 py-2 text-xs"
      : size === "xl"
        ? "px-6 py-3.5 text-base"
        : "px-4 py-2.5 text-sm";

  const themeClasses =
    theme === "light-green"
      ? "bg-secondary-500/90 text-grey-0 hover:bg-secondary-500 hover:shadow-glow-teal"
      : theme === "grey"
        ? "border border-primary-700/40 bg-primary-900/35 text-grey-0 hover:bg-primary-900/55 hover:border-primary-600/50"
        : theme === "black"
          ? "bg-primary-900/70 text-grey-0 hover:bg-primary-900"
          : theme === "red"
            ? "bg-red-800/90 text-grey-0 hover:bg-red-900 hover:shadow-glow-danger"
            : "bg-primary-500 text-grey-0 hover:bg-primary-600 hover:shadow-glow-sm";

  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-250",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50",
    "disabled:pointer-events-none disabled:opacity-70",
    "active:scale-[0.97]",
    sizeClasses,
    themeClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...props}>
      {props.children}
    </button>
  );
};
