import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import {
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Building2,
  Search,
  Download,
  Check,
  Link2,
} from "lucide-react";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { DataGridTable } from "../../UI/DataGridTable/DataGridTable";
import { EmptyState } from "../../UI/EmptyState/EmptyState";
import { Popup } from "../../Layouts/Popup/Popup";
import { Button } from "../../UI/Button/Button";
import { useAppSelector } from "../../../hooks/storeHook";
import { type CatalogEntity } from "../../../stores/catalogSlice/catalogsSlice";
import { banks, generateMockOperations, type BankInfo, type BankOperation, type OperationType } from "./mockData";
import { IntegrationFilters, categoryColors, type FilterState } from "./IntegrationFilters";
import { parseDate } from "../../../utils/parseDate";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<BankOperation>();

const statusMap: Record<BankOperation["status"], { label: string; cls: string }> = {
  completed: { label: "Выполнена", cls: "badge--success" },
  pending: { label: "В обработке", cls: "badge--teal" },
  declined: { label: "Отклонена", cls: "badge--danger" },
};

const typeMap: Record<OperationType, { label: string; cls: string }> = {
  expense: { label: "Расход", cls: "text-red-400" },
  income: { label: "Доход", cls: "text-green-400" },
  transfer: { label: "Перевод", cls: "text-secondary-400" },
};

/* ─── Bank Card ─── */
const BankCard: FC<{
  bank: BankInfo;
  selected: boolean;
  onClick: () => void;
}> = ({ bank, selected, onClick }) => (
  <button
    onClick={onClick}
    className={[
      "group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300",
      selected
        ? "border-primary-500/40 bg-primary-500/10 shadow-glow-sm"
        : "border-primary-700/20 bg-primary-900/30 hover:border-primary-700/40 hover:bg-primary-900/50",
    ].join(" ")}
  >
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold transition-transform group-hover:scale-105"
      style={{ backgroundColor: bank.accent, color: bank.color }}
    >
      {bank.logo}
    </div>
    <div className="text-left">
      <p className="text-sm font-semibold text-grey-0">{bank.name}</p>
      <p className="text-[11px] text-grey-200/50">
        {selected ? "Подключён" : "Нажмите для выбора"}
      </p>
    </div>
    {selected && (
      <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 text-primary-400 animate-scale-in">
        <Check size={14} />
      </div>
    )}
  </button>
);

/* ─── Main ─── */
export const Integrations = () => {
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
  const [operations, setOperations] = useState<BankOperation[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    status: "all",
    category: "all",
  });
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [selectedOps, setSelectedOps] = useState<BankOperation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { start, end } = useAppSelector((st) => st.global.periodDate);

  const handleSelectBank = useCallback(
    (bank: BankInfo) => {
      setSelectedBank(bank);
      setIsLoading(true);
      setTimeout(() => {
        setOperations(generateMockOperations(start, end, 40));
        setIsLoading(false);
      }, 800);
    },
    [start, end]
  );

  useEffect(() => {
    if (selectedBank) {
      setIsLoading(true);
      setTimeout(() => {
        setOperations(generateMockOperations(start, end, 40));
        setIsLoading(false);
      }, 500);
    }
  }, [start, end, selectedBank]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(operations.map((op) => op.category));
    return Array.from(cats).sort();
  }, [operations]);

  const filtered = useMemo(() => {
    return operations.filter((op) => {
      if (filters.type !== "all" && op.type !== filters.type) return false;
      if (filters.status !== "all" && op.status !== filters.status) return false;
      if (filters.category !== "all" && op.category !== filters.category) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          op.description.toLowerCase().includes(q) ||
          op.category.toLowerCase().includes(q) ||
          op.mcc.includes(q)
        );
      }
      return true;
    });
  }, [operations, filters]);

  const totalSelected = useMemo(
    () => selectedOps.reduce((s, op) => s + Math.abs(op.amount), 0),
    [selectedOps]
  );

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("date", {
        header: "Дата",
        cell: (info) => parseDate.toString(new Date(info.getValue())),
        size: 160,
        meta: { truncate: true },
      }),
      columnHelper.accessor("type", {
        header: "Тип",
        cell: (info) => {
          const t = typeMap[info.getValue()];
          return <span className={`text-xs font-semibold ${t.cls}`}>{t.label}</span>;
        },
        size: 110,
      }),
      columnHelper.accessor("description", {
        header: "Описание",
        cell: (info) => info.getValue(),
        size: 220,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("category", {
        header: "Категория",
        cell: (info) => {
          const cat = info.getValue();
          const color = categoryColors[cat] ?? "#a89ba7";
          return (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {cat}
            </span>
          );
        },
        size: 200,
        meta: { truncate: true },
      }),
      columnHelper.accessor("amount", {
        header: "Сумма",
        cell: (info) => {
          const val = info.getValue();
          return (
            <span className={val < 0 ? "text-red-400" : "text-green-400"}>
              {val.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
            </span>
          );
        },
        size: 160,
        meta: { isNumeric: true },
      }),
      columnHelper.accessor("cashback", {
        header: "Кешбэк",
        cell: (info) => {
          const val = info.getValue();
          return val > 0
            ? <span className="text-green-400 text-xs">+{val.toLocaleString()} ₽</span>
            : <span className="text-grey-200/20 text-xs">—</span>;
        },
        size: 100,
        meta: { isNumeric: true },
      }),
      columnHelper.accessor("mcc", {
        header: "MCC",
        cell: (info) => <span className="text-grey-200/50 font-mono text-xs">{info.getValue()}</span>,
        size: 100,
      }),
      columnHelper.accessor("cardNumber", {
        header: "Карта",
        cell: (info) => <span className="text-grey-200/50 font-mono text-xs">{info.getValue()}</span>,
        size: 120,
      }),
      columnHelper.accessor("status", {
        header: "Статус",
        cell: (info) => {
          const st = statusMap[info.getValue()];
          return <span className={`badge ${st.cls}`}>{st.label}</span>;
        },
        size: 140,
      }),
    ] satisfies Array<ColumnDef<BankOperation, unknown>>;
  }, []);

  return (
    <>
      <ContentHeader
        title="Интеграции"
        subtitle="Импорт операций из банковских выписок"
        dateOn={{ isMonth: true, isYear: true }}
      >
        {/* Toolbar — icons panel like MyBudget */}
        <div className="flex items-center gap-1 rounded-xl border border-primary-700/20 bg-primary-800/30 p-0.5">
          <IntegrationFilters
            filters={filters}
            onChange={setFilters}
            categories={uniqueCategories}
          />

          {/* Search icon — quick toggle inline search */}
          <QuickSearch
            value={filters.search}
            onChange={(v) => setFilters((f) => ({ ...f, search: v }))}
          />

          {/* Link button */}
          <div className="group relative inline-flex">
            <button
              onClick={() => selectedOps.length > 0 && setShowLinkPopup(true)}
              className={[
                "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
                selectedOps.length > 0
                  ? "bg-primary-500/20 text-primary-400"
                  : "text-grey-200/20 cursor-not-allowed",
              ].join(" ")}
              disabled={selectedOps.length === 0}
            >
              <Link2 size={15} />
              {selectedOps.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary-500 text-[8px] font-bold text-white">
                  {selectedOps.length}
                </span>
              )}
            </button>
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary-800 px-2.5 py-1 text-[10px] text-grey-200/70 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Привязать к каталогу
            </span>
          </div>
        </div>
      </ContentHeader>

      <ContentMain>
        <div className="flex flex-col gap-6">
          {/* Bank selection */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-grey-200/60">Выберите банк</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {banks.map((bank) => (
                <BankCard
                  key={bank.id}
                  bank={bank}
                  selected={selectedBank?.id === bank.id}
                  onClick={() => handleSelectBank(bank)}
                />
              ))}
            </div>
          </div>

          {/* Operations section */}
          {selectedBank && (
            <div className="flex flex-col gap-4 animate-fade-in-up">
              {/* Summary bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-xs text-grey-200/50">
                  {filtered.length} из {operations.length} операций
                </div>
                {selectedOps.length > 0 && (
                  <div className="rounded-lg bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-400">
                    Выбрано: {selectedOps.length} на {totalSelected.toLocaleString("ru-RU")} ₽
                  </div>
                )}
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              ) : (
                <DataGridTable<BankOperation>
                  data={filtered}
                  columns={columns}
                  getRowId={(row) => row.id}
                  showRowNumber
                  enableSorting
                  enableColumnResizing
                  enableMultiSelect
                  onSelectionChange={setSelectedOps}
                  emptyState={
                    <EmptyState
                      icon={<Download size={24} />}
                      title="Операции не найдены"
                      subtitle="Попробуйте изменить фильтры или период"
                    />
                  }
                  getRowClassName={(row) =>
                    row.status === "declined" ? "opacity-50" : undefined
                  }
                />
              )}
            </div>
          )}

          {/* No bank selected */}
          {!selectedBank && (
            <EmptyState
              icon={<Building2 size={24} />}
              title="Выберите банк"
              subtitle="Для загрузки операций выберите банк из списка выше"
            />
          )}
        </div>
      </ContentMain>

      {/* Link to catalog popup */}
      {showLinkPopup && (
        <LinkToCatalogPopup
          operations={selectedOps}
          onClose={() => setShowLinkPopup(false)}
        />
      )}
    </>
  );
};

/* ─── Quick Search (icon that expands to input) ─── */
const QuickSearch: FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group relative inline-flex">
      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 animate-fade-in-down">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-200/40" />
            <input
              autoFocus
              type="text"
              placeholder="Поиск..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => { if (!value) setIsOpen(false); }}
              className="app-input w-[280px] py-2 pl-9 text-sm shadow-card"
            />
          </div>
        </div>
      ) : null}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
          value || isOpen
            ? "bg-primary-500/20 text-primary-400"
            : "text-grey-200/40 hover:bg-accent-500/15 hover:text-accent-400",
        ].join(" ")}
      >
        <Search size={15} />
      </button>
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary-800 px-2.5 py-1 text-[10px] text-grey-200/70 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        Поиск
      </span>
    </div>
  );
};

/* ─── Link to Catalog Popup ─── */
const LinkToCatalogPopup: FC<{
  operations: BankOperation[];
  onClose: () => void;
}> = ({ operations, onClose }) => {
  const catalogs = useAppSelector((st) => st.catalogs);
  const [selectedCatalog, setSelectedCatalog] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const expCatalogs: CatalogEntity[] = Array.isArray(catalogs.expCatalogsArr)
    ? catalogs.expCatalogsArr
    : [];

  const total = operations.reduce((s, op) => s + Math.abs(op.amount), 0);

  const handleSave = () => {
    if (!selectedCatalog) {
      toast.error("Выберите категорию");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      toast.success(`${operations.length} операций привязано к каталогу`);
      setSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <Popup
      onClose={onClose}
      wide={560}
      title="Привязка к каталогу"
      subtitle={`${operations.length} операций на сумму ${total.toLocaleString("ru-RU")} ₽`}
      icon={<Link2 size={18} />}
    >
      <div className="flex flex-col gap-5">
        {/* Operations preview */}
        <div>
          <p className="mb-2 text-xs font-semibold text-grey-200/60">Выбранные операции</p>
          <div className="custom-scrollbar max-h-[200px] overflow-y-auto rounded-xl border border-primary-700/20 bg-primary-900/20">
            {operations.map((op) => (
              <div
                key={op.id}
                className="flex items-center justify-between border-b border-primary-700/10 px-4 py-2.5 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-grey-0">{op.description}</p>
                  <p className="text-[11px] text-grey-200/40">
                    {parseDate.toString(new Date(op.date))} &middot; {op.category}
                  </p>
                </div>
                <span className="ml-3 shrink-0 text-sm font-medium text-red-400">
                  {op.amount.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog selection */}
        <div>
          <p className="mb-2 text-xs font-semibold text-grey-200/60">Категория расходов</p>
          <div className="grid grid-cols-2 gap-2">
            {expCatalogs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatalog(cat.id)}
                className={[
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-200",
                  selectedCatalog === cat.id
                    ? "border-primary-500/40 bg-primary-500/10 text-grey-0 shadow-glow-sm"
                    : "border-primary-700/20 text-grey-200/70 hover:border-primary-700/40 hover:bg-primary-900/40",
                ].join(" ")}
              >
                <div
                  className="h-3 w-3 rounded-sm shrink-0"
                  style={{ backgroundColor: cat.catalogColor || "#FF7582" }}
                />
                <span className="truncate">{cat.catalogName}</span>
                {selectedCatalog === cat.id && (
                  <Check size={14} className="ml-auto shrink-0 text-primary-400" />
                )}
              </button>
            ))}
          </div>
          {expCatalogs.length === 0 && (
            <p className="py-4 text-center text-xs text-grey-200/40">
              Нет категорий расходов. Создайте их в разделе Каталог.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            onClick={onClose}
            className="border border-primary-700/30 bg-transparent text-grey-200/70 hover:bg-primary-700/20 hover:text-grey-0"
          >
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving || !selectedCatalog}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>
    </Popup>
  );
};
