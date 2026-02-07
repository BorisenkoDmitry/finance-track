import type { FC, InputHTMLAttributes } from "react";
import { FieldWrapper } from "../../Wrappers/FieldWrapper/FieldWrapper";
import { BsCheck } from "react-icons/bs";

interface ICheckboxField
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label?: string;
  classNameCheckbox?: string;
  classNameField?: string;
  color?: string;
}

export const CheckboxField: FC<ICheckboxField> = ({
  classNameCheckbox,
  classNameField,
  color,
  label,
  checked,
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
        type="checkbox"
        {...props}
        checked={checked}
        className="peer sr-only"
      />
      <span
        className={[
          "flex h-[15px] w-[15px] items-center justify-center rounded-[4px] transition-[filter,box-shadow] duration-150",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/60",
          "hover:brightness-110",
          classNameCheckbox,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          backgroundColor: !checked ? "transparent" : color ? color : "#547171",
          border: `1px solid ${checked ? "transparent" : color ? color : "#547171"}`,
        }}
      >
        {checked && <BsCheck className="text-[20px] text-grey-0" />}
      </span>
    </FieldWrapper>
  );
};
