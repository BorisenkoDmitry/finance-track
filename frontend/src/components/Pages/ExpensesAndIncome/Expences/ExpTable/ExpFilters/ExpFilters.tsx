import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../hooks/storeHook";
import { useCatalogSelects } from "../../../../../../hooks/useCatalogSelects";
import { TypeCatalog } from "../../../../../../stores/catalogSlice/catalogsSlice";
import {
  onChangeSelectedFilter,
  type ExpItem,
} from "../../../../../../stores/expSlice/expSlice";
import { InputField } from "../../../../../UI/Input/Input";
import { SelectField } from "../../../../../UI/SelectField/SelectField";

interface FilterItem {
  label: string;
  value: keyof ExpItem;
}

const filterList: FilterItem[] = [
  { label: "Категории", value: "catalogId" },
  { label: "Описанию", value: "descr" },
  { label: "Цене", value: "price" },
];

export const ExpFilters = () => {
  const { key, value } = useAppSelector((state) => state.expInc.selectedFilter);
  const { listCatalog, selectedCatalog, setCurrentCatalog } = useCatalogSelects(
    TypeCatalog.exp
  );

  useEffect(() => {
    setCurrentCatalog(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

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
                key: x.value as keyof ExpItem,
                value: "",
              })
            );
          }
        }}
      />
      {key === "catalogId" ? (
        <SelectField
          label="Поиск по категории"
          list={[{ value: "Все", label: "Все" }, ...listCatalog]}
          selected={selectedCatalog}
          onChange={(v) => {
            dispatch(
              onChangeSelectedFilter({
                key: "catalogId",
                value: v.value === "Все" ? "" : v.value,
              })
            );
            setCurrentCatalog(v);
          }}
        />
      ) : (
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
      )}
    </div>
  );
};
