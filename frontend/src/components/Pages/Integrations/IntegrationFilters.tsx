import { useState, type FC } from "react";
import { Filter, Search, X } from "lucide-react";
import { Dropdown } from "../../UI/Dropdown/Dropdown";
import type { OperationType, BankOperation } from "./mockData";

const categoryColors: Record<string, string> = {
  "Продукты": "#4ade80",
  "Транспорт": "#60a5fa",
  "Маркетплейсы": "#c084fc",
  "Электроника": "#38bdf8",
  "Дом и ремонт": "#fb923c",
  "Кафе и рестораны": "#f472b6",
  "Здоровье": "#34d399",
  "Подписки": "#a78bfa",
  "Развлечения": "#fbbf24",
  "ЖКХ": "#94a3b8",
  "Связь": "#2dd4bf",
  "Авто": "#fb7185",
  "Одежда и спорт": "#e879f9",
  "Книги": "#fcd34d",
  "Пополнения": "#4ade80",
  "Переводы": "#60a5fa",
};

export { categoryColors };

export interface FilterState {
  search: string;
  type: OperationType | "all";
  status: BankOperation["status"] | "all";
  category: string;
}

interface IntegrationFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: string[];
}

export const IntegrationFilters: FC<IntegrationFiltersProps> = ({
  filters,
  onChange,
  categories,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = [
    filters.type !== "all",
    filters.status !== "all",
    filters.category !== "all",
    filters.search.length > 0,
  ].filter(Boolean).length;

  const resetAll = () => {
    onChange({ search: "", type: "all", status: "all", category: "all" });
  };

  return (
    <>
      {/* Trigger icon */}
      <div className="group relative inline-flex">
        <button
          onClick={() => setIsOpen(true)}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
            activeCount > 0
              ? "bg-primary-500/20 text-primary-400"
              : "text-grey-200/40 hover:bg-accent-500/15 hover:text-accent-400",
          ].join(" ")}
        >
          <Filter size={15} />
          {activeCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary-500 text-[8px] font-bold text-white">
              {activeCount}
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
                  <p className="text-[10px] text-grey-200/50">Настройте отображение операций</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="app-icon-btn h-8 w-8">
                <X size={15} />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                Поиск
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-200/40" />
                <input
                  type="text"
                  placeholder="Описание, категория, MCC..."
                  value={filters.search}
                  onChange={(e) => onChange({ ...filters, search: e.target.value })}
                  className="app-input py-2.5 pl-9 text-sm"
                />
              </div>
            </div>

            {/* Type */}
            <div className="mb-4">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                Тип операции
              </label>
              <Dropdown
                value={filters.type}
                onChange={(v) => onChange({ ...filters, type: v as OperationType | "all" })}
                className="w-full"
                options={[
                  { value: "all", label: "Все типы" },
                  { value: "expense", label: "Расходы" },
                  { value: "income", label: "Доходы" },
                  { value: "transfer", label: "Переводы" },
                ]}
              />
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                Статус
              </label>
              <Dropdown
                value={filters.status}
                onChange={(v) => onChange({ ...filters, status: v as BankOperation["status"] | "all" })}
                className="w-full"
                options={[
                  { value: "all", label: "Все статусы" },
                  { value: "completed", label: "Выполнена" },
                  { value: "pending", label: "В обработке" },
                  { value: "declined", label: "Отклонена" },
                ]}
              />
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                Категория
              </label>
              <Dropdown
                value={filters.category}
                onChange={(v) => onChange({ ...filters, category: v })}
                className="w-full"
                options={[
                  { value: "all", label: "Все категории" },
                  ...categories.map((cat) => ({
                    value: cat,
                    label: cat,
                    icon: (
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: categoryColors[cat] ?? "#a89ba7" }}
                      />
                    ),
                  })),
                ]}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={resetAll}
                className="text-xs text-grey-200/50 transition-colors hover:text-primary-400"
              >
                Сбросить всё
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
