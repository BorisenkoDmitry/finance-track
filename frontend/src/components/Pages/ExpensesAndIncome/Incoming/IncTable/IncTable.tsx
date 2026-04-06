import {
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useMemo, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";
import {
  setCurrentInc,
  toggleConfirm,
  toggleIncForm,
  type IncItem,
} from "../../../../../stores/incSlice/incSlice";
import { getIncApi } from "../../../../../stores/incSlice/incThunks";
import { IncTableControls } from "./IncRowControls/IncRowControls";
import { parseDate } from "../../../../../utils/parseDate";
import { DataGridTable } from "../../../../UI/DataGridTable/DataGridTable";
import { EmptyState } from "../../../../UI/EmptyState/EmptyState";
import { Pencil, Trash2, TrendingUp } from "lucide-react";

const columnHelper = createColumnHelper<IncItem>();

/* ─── Card View ─── */
const IncCardView: FC<{ list: IncItem[] }> = ({ list }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((item) => (
        <div
          key={item.id}
          className="group app-surface-strong flex flex-col p-4 animate-fade-in-up"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-green-500/20 opacity-20 blur-[2px]" />
                <TrendingUp size={16} className="relative text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-grey-0">
                  {item.source || "Без источника"}
                </p>
                <p className="text-[10px] text-grey-200/50">
                  {parseDate.toString(new Date(item.date))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/50 hover:bg-primary-700/30 hover:text-grey-0"
                onClick={() => { dispatch(setCurrentInc(item.id)); dispatch(toggleIncForm(true)); }}
              ><Pencil size={13} /></button>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/50 hover:bg-red-500/15 hover:text-red-400"
                onClick={() => { dispatch(setCurrentInc(item.id)); dispatch(toggleConfirm(true)); }}
              ><Trash2 size={13} /></button>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-2xl font-bold tabular-nums text-grey-0">
              +{Number(item.sum).toLocaleString()}
              <span className="ml-1 text-sm font-normal text-green-400/60">₽</span>
            </p>
          </div>

          {item.description && (
            <p className="mt-2 truncate text-xs text-grey-200/40">{item.description}</p>
          )}

          {(item.typeInc || item.method) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.typeInc && (
                <span className="rounded-md bg-primary-700/20 px-2 py-0.5 text-[10px] text-grey-200/50">{item.typeInc}</span>
              )}
              {item.method && (
                <span className="rounded-md bg-primary-700/20 px-2 py-0.5 text-[10px] text-grey-200/50">{item.method}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Main ─── */
export const IncTable: FC<{ viewMode?: string }> = ({ viewMode = "table" }) => {
  const {
    currentInc,
    selectedFilter: { key, value },
    incList,
  } = useAppSelector((state) => state.Inc);

  const { start, end } = useAppSelector((state) => state.global.periodDate);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getIncApi({
        dateEnd: end,
        dateStart: start,
        [key]: value,
      })
    );
  }, [dispatch, key, value, end, start]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("source", {
        id: "source",
        header: "Источник",
        cell: (info) => info.getValue(),
        size: 200,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("date", {
        id: "date",
        header: "Дата",
        cell: (info) => parseDate.toString(new Date(info.getValue())),
        size: 180,
        meta: { truncate: true },
      }),
      columnHelper.accessor("description", {
        id: "description",
        header: "Описание",
        cell: (info) => <span className="whitespace-normal break-words">{info.getValue()}</span>,
        size: 360,
        meta: { titleFromValue: true },
      }),
      columnHelper.accessor("method", {
        id: "method",
        header: "Способ оплаты",
        cell: (info) => info.getValue(),
        size: 160,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("typeInc", {
        id: "typeInc",
        header: "Тип дохода",
        cell: (info) => info.getValue(),
        size: 160,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("sum", {
        id: "sum",
        header: "Доход",
        cell: (info) => (
          <span className="font-medium text-green-400">
            +{Number(info.getValue()).toLocaleString()} ₽
          </span>
        ),
        size: 160,
        meta: { isNumeric: true, truncate: true },
      }),
    ] satisfies Array<ColumnDef<IncItem, unknown>>;
  }, []);

  const sumCount = useMemo(() => {
    return incList.reduce((acc, item) => {
      const p = Number(item?.sum ?? 0);
      return acc + (Number.isFinite(p) ? p : 0);
    }, 0);
  }, [incList]);

  if (incList.length === 0) return <EmptyState title="Нет доходов" subtitle="За выбранный период записей нет" />;

  if (viewMode === "cards") {
    return (
      <>
        <IncCardView list={incList} />
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-primary-700/20 bg-primary-800/20 px-5 py-3">
          <span className="text-sm font-medium text-grey-200/60">Сумма доходов:</span>
          <span className="text-lg font-bold tabular-nums text-green-400">
            +{sumCount.toLocaleString()} ₽
          </span>
        </div>
      </>
    );
  }

  return (
    <>
    {/* Mobile: stat card + section header */}
    <div className="flex flex-col gap-3 lg:hidden">
      <div className="flex items-center justify-between rounded-2xl border border-green-500/10 bg-green-500/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-green-400/60" />
          <span className="text-xs font-medium text-grey-200/50">Доходы за период</span>
        </div>
        <span className="text-lg font-bold tabular-nums text-green-400">+{sumCount.toLocaleString()} ₽</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-grey-200/30">Операции</span>
        <span className="text-[10px] text-grey-200/20">{incList.length} записей</span>
      </div>
    </div>

    <DataGridTable<IncItem>
      data={incList}
      columns={columns}
      getRowId={(row) => row.id}
      showRowNumber
      enableSorting
      enableColumnResizing
      getRowClassName={(row) =>
        row.id === currentInc.id ? "ring-2 ring-secondary-500/40 border-secondary-500/30" : undefined
      }
      renderRowActions={(row) => (
        <IncTableControls
          onEdit={() => {
            dispatch(setCurrentInc(row.id));
            dispatch(toggleIncForm(true));
          }}
          onDelete={() => {
            dispatch(setCurrentInc(row.id));
            dispatch(toggleConfirm(true));
          }}
        />
      )}
      renderFooter={({ gridTemplateColumns }) => (
        <div
          role="row"
          className="grid items-center rounded-2xl border border-primary-700/20 bg-primary-800/20"
          style={{ gridTemplateColumns }}
        >
          <div role="cell" className="col-span-6 px-4 py-3 text-sm font-medium text-grey-200/60">Сумма доходов:</div>
          <div role="cell" className="col-span-2 px-4 py-3 text-right text-lg font-bold tabular-nums text-green-400">
            +{sumCount.toLocaleString()} ₽
          </div>
        </div>
      )}
    />
    </>
  );
};
