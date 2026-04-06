import {
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useMemo, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import {
  setChoosed,
  setCurrentBudget,
  setToggleConfirm,
  setToggleForm,
  type myBudgetItem,
} from "../../../../stores/budgetSlice/myBudgetSlice";
import { getBudgetsApi } from "../../../../stores/budgetSlice/myBudgetThunks";
import { TypeCatalog } from "../../../../stores/catalogSlice/catalogsSlice";
import {
  DataGridTable,
  type DataGridColumnMeta,
} from "../../../UI/DataGridTable/DataGridTable";
import { Pencil, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { EmptyState } from "../../../UI/EmptyState/EmptyState";

const columnHelper = createColumnHelper<myBudgetItem>();

/* ─── Card view for budget items ─── */
const BudgetCardView: FC<{ list: myBudgetItem[] }> = ({ list }) => {
  const dispatch = useAppDispatch();

  if (list.length === 0) return <EmptyState title="Нет данных" subtitle="За выбранный период записей нет" />;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((item) => {
        const isExp = item.type === TypeCatalog.exp;
        return (
          <div
            key={item.id}
            className="group app-surface-strong flex flex-col p-4 animate-fade-in-up"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-lg opacity-20 blur-[2px]" style={{ backgroundColor: item.color || (isExp ? "#FF7582" : "#4ade80") }} />
                  <div className="relative h-4 w-4 rounded-md" style={{ backgroundColor: item.color || (isExp ? "#FF7582" : "#4ade80") }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-grey-0">{item.categoryName}</p>
                  <p className="flex items-center gap-1 text-[10px] text-grey-200/50">
                    {isExp ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                    {isExp ? "Расход" : "Доход"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/50 hover:bg-primary-700/30 hover:text-grey-0"
                  onClick={() => { dispatch(setCurrentBudget({ id: item.id })); dispatch(setToggleForm(true)); }}
                ><Pencil size={13} /></button>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/50 hover:bg-red-500/15 hover:text-red-400"
                  onClick={() => { dispatch(setCurrentBudget({ id: item.id })); dispatch(setToggleConfirm(true)); }}
                ><Trash2 size={13} /></button>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-2xl font-bold tabular-nums text-grey-0">
                {Number(item.planned_amount).toLocaleString()}
                <span className="ml-1 text-sm font-normal text-grey-200/50">₽</span>
              </p>
            </div>

            {item.comment && (
              <p className="mt-2 text-xs text-grey-200/40 truncate">{item.comment}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─── Main ─── */
export const BudgetTable: FC<{ viewMode?: string }> = ({ viewMode = "table" }) => {
  const {
    list,
    filters: { type },
  } = useAppSelector((state) => state.budget);
  const { end, start } = useAppSelector((st) => st.global.periodDate);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBudgetsApi({ type, dateStart: start, dateEnd: end }));
  }, [dispatch, type, end, start]);

  const columns = useMemo(() => {
    const meta = (m: DataGridColumnMeta) => m as unknown as ColumnDef<myBudgetItem, unknown>["meta"];
    return [
      columnHelper.accessor("categoryName", {
        cell: (info) => info.getValue(),
        header: "Категория",
        size: 260,
        meta: meta({ titleFromValue: true }),
      }),
      columnHelper.accessor("type", {
        cell: (info) => info.getValue() === TypeCatalog.exp ? "Расход" : "Доход",
        header: "Тип",
        size: 120,
      }),
      columnHelper.accessor("period", {
        cell: (info) => info.getValue() === "month" && "месяц",
        header: "Период",
        size: 100,
      }),
      columnHelper.accessor("color", {
        cell: (info) => (
          <div className="relative flex h-6 w-6 items-center justify-center">
            <div className="absolute inset-0 rounded opacity-20 blur-[1px]" style={{ backgroundColor: info.getValue() }} />
            <div className="relative h-3 w-3 rounded-sm" style={{ backgroundColor: info.getValue() }} />
          </div>
        ),
        header: "Цвет",
        size: 80,
      }),
      columnHelper.accessor("comment", {
        cell: (info) => info.getValue(),
        header: "Примечание",
        size: 200,
        meta: meta({ titleFromValue: true }),
      }),
      columnHelper.accessor("planned_amount", {
        cell: (info) => Number(info.getValue()).toLocaleString() + " ₽",
        header: "Бюджет",
        size: 180,
        meta: meta({ isNumeric: true }),
      }),
    ];
  }, []);

  const footerTotal = useMemo(() => {
    if (type === 5) {
      const sumInc = list.filter((x) => x.type === TypeCatalog.inc).reduce((a, i) => a + (Number(i?.planned_amount) || 0), 0);
      const sumExp = list.filter((x) => x.type === TypeCatalog.exp).reduce((a, i) => a + (Number(i?.planned_amount) || 0), 0);
      return { sum: sumInc - sumExp, title: "Остаток:" };
    }
    return { sum: list.reduce((a, i) => a + (Number(i?.planned_amount) || 0), 0), title: "Итого:" };
  }, [list, type]);

  if (list.length === 0) return <EmptyState title="Нет данных" subtitle="За выбранный период записей нет" />;

  return (
    <>
      {viewMode === "cards" ? (
        <>
          <BudgetCardView list={list} />
          {/* Footer summary */}
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-primary-700/20 bg-primary-800/20 px-5 py-3">
            <span className="text-sm font-medium text-grey-200/60">{footerTotal.title}</span>
            <span className={`text-lg font-bold tabular-nums ${footerTotal.sum >= 0 ? "text-green-400" : "text-red-400"}`}>
              {footerTotal.sum.toLocaleString()} ₽
            </span>
          </div>
        </>
      ) : (
        <DataGridTable<myBudgetItem>
          data={list}
          columns={columns}
          getRowId={(row) => row.id}
          enableMultiSelect
          enableColumnResizing
          onEditRow={(row) => { dispatch(setCurrentBudget({ id: row.id })); dispatch(setToggleForm(true)); }}
          onDeleteRow={(row) => { dispatch(setCurrentBudget({ id: row.id })); dispatch(setToggleConfirm(true)); }}
          onSelectionChange={(selected) => { dispatch(setChoosed(null)); selected.forEach((item) => dispatch(setChoosed(item))); }}
          renderFooter={({ gridTemplateColumns }) => (
            <div role="row" className="grid items-center rounded-2xl border border-primary-700/20 bg-primary-800/20" style={{ gridTemplateColumns }}>
              <div role="cell" className="col-span-6 px-4 py-3 text-sm font-medium text-grey-200/60">{footerTotal.title}</div>
              <div role="cell" className="col-span-2 px-4 py-3 text-right text-lg font-bold tabular-nums text-primary-400">{footerTotal.sum.toLocaleString()} ₽</div>
            </div>
          )}
        />
      )}
    </>
  );
};
