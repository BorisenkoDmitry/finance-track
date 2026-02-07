 
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { FieldWrapper } from "../../Wrappers/FieldWrapper/FieldWrapper";

interface IInputField extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  classNameInput?: string;
  classNameField?: string;
  errorText?: string | null;
}

export const InputField = forwardRef<HTMLInputElement, IInputField>(
  ({ classNameInput, classNameField, label, errorText, ...props }, ref) => {
    const inputClassName = [
      "app-input",
      errorText ? "app-input--error" : "",
      classNameInput,
    ]
      .filter(Boolean)
      .join(" ");
    if (label)
      return (
        <FieldWrapper label={label} classField={classNameField}>
          <input ref={ref} {...props} className={inputClassName} />
          {errorText && (
            <span className="text-xs text-red-500">{errorText}</span>
          )}
        </FieldWrapper>
      );
    else {
      return (
        <FieldWrapper classField={classNameField}>
          <input ref={ref} {...props} className={inputClassName} />
          {errorText && (
            <span className="text-xs text-red-500">{errorText}</span>
          )}
        </FieldWrapper>
      );
    }
  }
);
