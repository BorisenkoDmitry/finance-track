import type { FC } from "react";

interface IFieldWrapper {
  label?: string;
  children: React.ReactNode;
  classField?: string;
  tagWrapp?: "label" | "div";
}

export const FieldWrapper: FC<IFieldWrapper> = ({
  label,
  tagWrapp = "label",
  children,
  classField,
}) => {
  const wrapperClassName = classField
    ? `flex flex-col gap-1.5 ${classField}`
    : "flex flex-col gap-1.5";
  if (tagWrapp === "label") {
    return (
      <>
        <label
          className={wrapperClassName}
        >
          {label && (
            <span className="rounded px-1.5 py-0.5 text-xs">{label}</span>
          )}
          {children}
        </label>
      </>
    );
  } else {
    return (
      <>
        <div className={wrapperClassName}>
          {label && (
            <span className="rounded px-1.5 py-0.5 text-xs">{label}</span>
          )}
          {children}
        </div>
      </>
    );
  }
};
