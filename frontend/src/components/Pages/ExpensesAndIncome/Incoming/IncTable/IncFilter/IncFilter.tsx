import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../hooks/storeHook";

import {
  onChangeSelectedFilter,
  type IncItem,
} from "../../../../../../stores/incSlice/incSlice";
import { InputField } from "../../../../../UI/Input/Input";
import { SelectField } from "../../../../../UI/SelectField/SelectField";

interface FilterItem {
  label: string;
  value: keyof IncItem;
}

const filterList: FilterItem[] = [
  { label: "Источник", value: "source" },
  { label: "Описанию", value: "description" },
  { label: "Цене", value: "sum" },
];

export const IncFilters = () => {
  const { key, value } = useAppSelector((state) => state.Inc.selectedFilter);

  const dispatch = useAppDispatch();

  return (
    <div className="sticky top-0 z-[1] mb-8 flex gap-5 bg-[color:var(--bg-body-crl)] p-2.5">
      <SelectField
        label="Выберите категорию для поиска"
        selected={filterList.find((x) => x.value === key)}
        list={filterList}
        onChange={(x) => {
          if (x) {
            dispatch(
              onChangeSelectedFilter({
                key: x.value as keyof IncItem,
                value: "",
              })
            );
          }
        }}
      />

      <InputField
        placeholder="Введите текст"
        value={value}
        label={`Поиск по ${filterList
          .find((x) => x.value === key)
          ?.label.toLowerCase()}`}
        onChange={(e) => {
          dispatch(
            onChangeSelectedFilter({
              key,
              value: e.target.value,
            })
          );
        }}
      />
    </div>
  );
};
