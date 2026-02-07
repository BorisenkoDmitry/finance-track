import { type FC } from "react";
import Select, { type SingleValue } from "react-select";
import { FieldWrapper } from "../../Wrappers/FieldWrapper/FieldWrapper";


interface IOption {
    label: string;
    value: string;
}

interface ISelectField {
  label?: string;
  list: Array<IOption>;
  selected: SingleValue<IOption> | undefined,
  onChange: (v: SingleValue<IOption>) => void;
}

export const SelectField: FC<ISelectField> = ({ label, list, selected, onChange }) => {
  return (
    <>
      <FieldWrapper label={label}>
        <Select
          value={selected}
          options={list}
          placeholder="Не выбрано"
          onChange={onChange}
          unstyled
          classNames={{
            control: (state) =>
              [
                "app-input min-h-12 cursor-pointer px-3 py-0",
                state.isFocused ? "ring-2 ring-primary-500/40 border-primary-500/70" : "",
              ].join(" "),
            valueContainer: () => "py-2 text-base",
            placeholder: () => "text-grey-200/60",
            singleValue: () => "text-grey-0",
            indicatorsContainer: () => "text-grey-200",
            menu: () =>
              "mt-1 overflow-hidden rounded-xl border border-primary-700/40 bg-primary-900/95 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.85)] backdrop-blur",
            option: (state) =>
              [
                "cursor-pointer px-3 py-2 text-sm",
                state.isSelected ? "bg-primary-700/35 font-semibold text-grey-0" : "text-grey-100",
                state.isFocused ? "bg-primary-700/25" : "",
              ]
                .filter(Boolean)
                .join(" "),
          }}
        />
      </FieldWrapper>
    </>
  );
};
