import type { FC, InputHTMLAttributes } from "react";
import { FieldWrapper } from "../../Wrappers/FieldWrapper/FieldWrapper";

interface IRadioField
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  classNameRadio?: string;
  classNameField?: string;
}

export const RadioField: FC<IRadioField> = ({
  classNameRadio,
  classNameField,
  label,
  ...props
}) => {
  return (
    <FieldWrapper
      label={label}
      classField={[
        "inline-flex max-w-max cursor-pointer flex-row-reverse items-center justify-end gap-1.5",
        classNameField,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="radio"
        {...props}
        className="peer sr-only"
      />
      <span
        className={[
          "relative h-[15px] w-[15px] rounded-full border border-brand-primary",
          "after:absolute after:left-[2px] after:top-[2px] after:h-[9px] after:w-[9px] after:rounded-full after:bg-brand-primary after:opacity-0",
          "peer-checked:after:opacity-100",
          "transition-[filter,box-shadow] duration-150 hover:brightness-110",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/60",
          classNameRadio,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </FieldWrapper>
  );
};
