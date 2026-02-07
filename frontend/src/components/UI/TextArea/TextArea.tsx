import type { FC, TextareaHTMLAttributes } from "react";
import { FieldWrapper } from "../../Wrappers/FieldWrapper/FieldWrapper";
import React from "react";

interface ITextArea extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorText?: string;
}

export const TextAreaField: FC<ITextArea> = React.forwardRef<
  HTMLTextAreaElement,
  ITextArea
>(({ label, errorText, className, ...props }, ref) => {
  const textareaClassName = [
    "app-input min-h-20 resize-none",
    errorText ? "app-input--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <FieldWrapper label={label}>
        <textarea className={textareaClassName} {...props} ref={ref} />
        {errorText && <span className="text-xs text-red-500">{errorText}</span>}
      </FieldWrapper>
    </>
  );
});
