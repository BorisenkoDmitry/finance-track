import { useEffect, useState, type FC } from "react";
import { Filter, Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { useCatalogSelects } from "../../../hooks/useCatalogSelects";
import { TypeCatalog } from "../../../stores/catalogSlice/catalogsSlice";
import {
  onChangeSelectedFilter as onChangeExpFilter,
  type ExpItem,
} from "../../../stores/expSlice/expSlice";
import {
  onChangeSelectedFilter as onChangeIncFilter,
  type IncItem,
} from "../../../stores/incSlice/incSlice";
import { Dropdown } from "../../UI/Dropdown/Dropdown";

const expFilterList = [
  { label: "Категории", value: "catalogId" },
  { label: "Описанию", value: "descr" },
  { label: "Цене", value: "price" },
];

const incFilterList = [
  { label: "Источник", value: "source" },
  { label: "Описанию", value: "description" },
  { label: "Цене", value: "sum" },
];

export const ExpIncFilters: FC<{ mode: "spend" | "income" }> = ({ mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const expFilter = useAppSelector((st) => st.expInc.selectedFilter);
  const incFilter = useAppSelector((st) => st.Inc.selectedFilter);

  const currentFilter = mode === "spend" ? expFilter : incFilter;
  const filterList = mode === "spend" ? expFilterList : incFilterList;

  const { listCatalog, selectedCatalog, setCurrentCatalog } = useCatalogSelects(
    TypeCatalog.exp
  );

  useEffect(() => {
    setCurrentCatalog(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilter.key]);

  const setFilter = (key: string, value: string) => {
    if (mode === "spend") {
      dispatch(onChangeExpFilter({ key: key as keyof ExpItem, value }));
    } else {
      dispatch(onChangeIncFilter({ key: key as keyof IncItem, value }));
    }
  };

  const hasActiveFilter = currentFilter.value.length > 0;

  return (
    <>
      {/* Trigger icon */}
      <div className="group relative inline-flex">
        <button
          onClick={() => setIsOpen(true)}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
            hasActiveFilter
              ? "bg-primary-500/20 text-primary-400"
              : "text-grey-200/40 hover:bg-accent-500/15 hover:text-accent-400",
          ].join(" ")}
        >
          <Filter size={15} />
          {hasActiveFilter && (
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary-500 text-[8px] font-bold text-white">
              1
            </span>
          )}
        </button>
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary-800 px-2.5 py-1 text-[10px] text-grey-200/70 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Фильтры
        </span>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-primary-800/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-primary-700/25 bg-bg-menu/98 p-6 shadow-xl animate-scale-in">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/15 text-primary-400">
                  <Filter size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-grey-0">Фильтры</h3>
                  <p className="text-[10px] text-grey-200/50">
                    {mode === "spend" ? "Поиск по расходам" : "Поиск по доходам"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="app-icon-btn h-8 w-8">
                <X size={15} />
              </button>
            </div>

            {/* Filter by */}
            <div className="mb-4">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                Поиск по
              </label>
              <Dropdown
                value={currentFilter.key}
                onChange={(v) => setFilter(v, "")}
                className="w-full"
                options={filterList.map((f) => ({ value: f.value, label: f.label }))}
              />
            </div>

            {/* Value */}
            <div className="mb-5">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                Значение
              </label>
              {mode === "spend" && currentFilter.key === "catalogId" ? (
                <Dropdown
                  value={selectedCatalog?.value ?? ""}
                  onChange={(v) => {
                    const val = v === "Все" ? "" : v;
                    setFilter("catalogId", val);
                    const found = listCatalog.find((c) => c?.value === v);
                    setCurrentCatalog(found ?? null);
                  }}
                  className="w-full"
                  options={[
                    { value: "Все", label: "Все" },
                    ...listCatalog
                      .filter((c): c is NonNullable<typeof c> => c !== null)
                      .map((c) => ({ value: c.value, label: c.label })),
                  ]}
                />
              ) : (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-200/40" />
                  <input
                    autoFocus
                    type="text"
                    placeholder={`Поиск по ${filterList.find((f) => f.value === currentFilter.key)?.label.toLowerCase() ?? ""}...`}
                    value={currentFilter.value}
                    onChange={(e) => setFilter(currentFilter.key, e.target.value)}
                    className="app-input py-2.5 pl-9 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setFilter(currentFilter.key, "")}
                className="text-xs text-grey-200/50 transition-colors hover:text-primary-400"
              >
                Сбросить
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-primary-500/20 px-5 py-2 text-sm font-semibold text-primary-400 transition-all hover:bg-primary-500/30 hover:shadow-glow-sm"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
