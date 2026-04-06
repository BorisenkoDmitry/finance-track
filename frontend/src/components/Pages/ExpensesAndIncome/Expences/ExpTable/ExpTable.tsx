import {
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";
import {
  setCurrentExp,
  toggleConfirm,
  toggleExpForm,
  type ExpItem,
} from "../../../../../stores/expSlice/expSlice";
import { getExpApi } from "../../../../../stores/expSlice/expThunks";
import { parseDate } from "../../../../../utils/parseDate";
import { ExpTableControls } from "./ExpTableControls/ExpTableControls";
import useDebounce from "../../../../../hooks/useDebounce";
import { DataGridTable } from "../../../../UI/DataGridTable/DataGridTable";
import { EmptyState } from "../../../../UI/EmptyState/EmptyState";
import { Pencil, Trash2, Package, TrendingDown } from "lucide-react";

const columnHelper = createColumnHelper<ExpItem>();
type ExpProduct = ExpItem["products"][number];
const productColumnHelper = createColumnHelper<ExpProduct>();
const productColumns = [
  productColumnHelper.accessor("name", {
    id: "name",
    header: "Название товара",
    cell: (info) => info.getValue(),
    size: 420,
    meta: { truncate: true, titleFromValue: true },
  }),
  productColumnHelper.accessor("count", {
    id: "count",
    header: "Кол. / вес",
    cell: (info) => String(info.getValue() ?? ""),
    size: 160,
    meta: { truncate: true },
  }),
  productColumnHelper.accessor("price", {
    id: "price",
    header: "Цена",
    cell: (info) => Number(info.getValue()).toLocaleString() + ` ₽`,
    size: 140,
    meta: { isNumeric: true, truncate: true },
  }),
] satisfies Array<ColumnDef<ExpProduct, unknown>>;

/* ─── Card View ─── */
const ExpCardView: FC<{ list: ExpItem[] }> = ({ list }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((item) => (
        <div
          key={item.id}
          className="group app-surface-strong flex flex-col p-4 animate-fade-in-up"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-red-500/20 opacity-20 blur-[2px]" />
                <div className="relative h-4 w-4 rounded-md bg-red-500/60" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-grey-0">
                  {item.categoryName || "Без категории"}
                </p>
                <p className="text-[10px] text-grey-200/50">
                  {parseDate.toString(new Date(item.date))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/50 hover:bg-primary-700/30 hover:text-grey-0"
                onClick={() => { dispatch(setCurrentExp(item.id)); dispatch(toggleExpForm(true)); }}
              ><Pencil size={13} /></button>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/50 hover:bg-red-500/15 hover:text-red-400"
                onClick={() => { dispatch(setCurrentExp(item.id)); dispatch(toggleConfirm(true)); }}
              ><Trash2 size={13} /></button>
            </div>
          </div>

          {/* Price */}
          <div className="mt-3">
            <p className="text-2xl font-bold tabular-nums text-grey-0">
              {Number(item.price).toLocaleString()}
              <span className="ml-1 text-sm font-normal text-grey-200/50">₽</span>
            </p>
          </div>

          {/* Description */}
          {item.descr && (
            <p className="mt-2 truncate text-xs text-grey-200/40">{item.descr}</p>
          )}

          {/* Products badge */}
          {item.products.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-grey-200/40">
              <Package size={11} />
              <span>{item.products.length} товаров</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Main ─── */
export const ExpTable: FC<{ viewMode?: string }> = ({ viewMode = "table" }) => {
  const {
    exp,
    currentExp,
    selectedFilter: { key, value },
  } = useAppSelector((state) => state.expInc);

  const { start, end } = useAppSelector((state) => state.global.periodDate);
  const debValue = useDebounce(value, 300);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getExpApi({
        [key]: debValue,
        dateStart: start,
        dateEnd: end,
      })
    );
  }, [dispatch, key, debValue, end, start]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("categoryName", {
        id: "categoryName",
        header: "Категория",
        cell: (info) => info.getValue(),
        size: 240,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("date", {
        id: "date",
        header: "Дата",
        cell: (info) => parseDate.toString(new Date(info.getValue())),
        size: 180,
        meta: { truncate: true },
      }),
      columnHelper.accessor("descr", {
        id: "descr",
        header: "Описание",
        cell: (info) => <span className="whitespace-normal break-words">{info.getValue()}</span>,
        size: 380,
        meta: { titleFromValue: true },
      }),
      columnHelper.accessor("price", {
        id: "price",
        header: "Цена",
        cell: (info) => (
          <span className="font-medium text-red-400">
            {Number(info.getValue()).toLocaleString()} ₽
          </span>
        ),
        size: 160,
        meta: { isNumeric: true, truncate: true },
      }),
    ] satisfies Array<ColumnDef<ExpItem, unknown>>;
  }, []);

  const [openProductsById, setOpenProductsById] = useState<Record<string, boolean>>({});

  const sumCount = useMemo(() => {
    return exp.reduce((acc, item) => {
      const p = Number(item?.price ?? 0);
      return acc + (Number.isFinite(p) ? p : 0);
    }, 0);
  }, [exp]);

  if (exp.length === 0) return <EmptyState title="Нет расходов" subtitle="За выбранный период записей нет" />;

  if (viewMode === "cards") {
    return (
      <>
        <ExpCardView list={exp} />
        {/* Footer summary */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-primary-700/20 bg-primary-800/20 px-5 py-3">
          <span className="text-sm font-medium text-grey-200/60">Сумма:</span>
          <span className="text-lg font-bold tabular-nums text-red-400">
            {sumCount.toLocaleString()} ₽
          </span>
        </div>
      </>
    );
  }

  return (
    <>
    {/* Mobile: stat card + section header */}
    <div className="flex flex-col gap-3 lg:hidden">
      {/* Stat */}
      <div className="flex items-center justify-between rounded-2xl border border-red-500/10 bg-red-500/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <TrendingDown size={16} className="text-red-400/60" />
          <span className="text-xs font-medium text-grey-200/50">Расходы за период</span>
        </div>
        <span className="text-lg font-bold tabular-nums text-red-400">{sumCount.toLocaleString()} ₽</span>
      </div>
      {/* Section label */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-grey-200/30">Операции</span>
        <span className="text-[10px] text-grey-200/20">{exp.length} записей</span>
      </div>
    </div>

    <DataGridTable<ExpItem>
      data={exp}
      columns={columns}
      getRowId={(row) => row.id}
      showRowNumber
      enableSorting
      enableColumnResizing
      getRowClassName={(row) =>
        row.id === currentExp.id ? "ring-2 ring-secondary-500/40 border-secondary-500/30" : undefined
      }
      renderRowActions={(row) => {
        const isOpen = Boolean(openProductsById[row.id]);
        return (
          <ExpTableControls
            onEdit={() => {
              dispatch(setCurrentExp(row.id));
              dispatch(toggleExpForm(true));
            }}
            onDelete={() => {
              dispatch(setCurrentExp(row.id));
              dispatch(toggleConfirm(true));
            }}
            onOpenProducts={() =>
              setOpenProductsById((prev) => ({ ...prev, [row.id]: !Boolean(prev[row.id]) }))
            }
            isActiveProduct={isOpen}
            isVisibleProduct={row.products.length > 0}
          />
        );
      }}
      renderRowAfter={({ row }) => {
        const isOpen = Boolean(openProductsById[row.id]);
        if (!isOpen || !row.products || row.products.length === 0) return null;
        return (
          <div className="px-2 pb-1">
            <DataGridTable<ExpProduct>
              data={row.products}
              columns={productColumns}
              showRowNumber
              rowNumberColumnSize={56}
              enableSorting={false}
              enableColumnResizing={false}
              className="bg-transparent shadow-none"
            />
          </div>
        );
      }}
      renderFooter={({ gridTemplateColumns }) => (
        <div
          role="row"
          className="grid items-center rounded-2xl border border-primary-700/20 bg-primary-800/20"
          style={{ gridTemplateColumns }}
        >
          <div role="cell" className="col-span-4 px-4 py-3 text-sm font-medium text-grey-200/60">Сумма:</div>
          <div role="cell" className="col-span-2 px-4 py-3 text-right text-lg font-bold tabular-nums text-red-400">
            {sumCount.toLocaleString()} ₽
          </div>
        </div>
      )}
    />
    </>
  );
};
