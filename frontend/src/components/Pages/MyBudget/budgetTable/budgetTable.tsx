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

const columnHelper = createColumnHelper<myBudgetItem>();

export const BudgetTable: FC = () => {
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
      // columnHelper.accessor("id", {
      //   cell: (info) => info.getValue(),
      //   footer: (info) => info.column.id,
      // }),
      columnHelper.accessor("categoryName", {
        cell: (info) => info.getValue(),
        header: "Название категории",
        size: 260,
        meta: meta({ titleFromValue: true }),
      }),
      columnHelper.accessor("type", {
        cell: (info) =>
          info.getValue() === TypeCatalog.exp ? "Расход" : "Доход",
        header: "Тип категории",
        size: 160,
        meta: meta({}),
      }),
      columnHelper.accessor("period", {
        cell: (info) => info.getValue() === "month" && "месяц",
        header: "Период",
        size: 110,
        meta: meta({}),
      }),
      columnHelper.accessor("color", {
        cell: (info) => (
          <div
            className="mx-auto h-6 w-6 rounded-full shadow-[0_0_0_4px_rgba(99,89,233,0.14)] ring-1 ring-primary-700/50"
            style={{ backgroundColor: info.getValue() }}
          />
        ),
        header: "Цвет indicator",
        size: 120,
        meta: meta({}),
      }),
      columnHelper.accessor("comment", {
        cell: (info) => info.getValue(),
        header: "Примечание",
        size: 200,
        meta: meta({ titleFromValue: true }),
      }),
      columnHelper.accessor("planned_amount", {
        cell: (info) => Number(info.getValue()).toLocaleString() + ` ₽`,
        header: "Запланированный бюджет на месяц",
        size: 240,
        meta: meta({ isNumeric: true }),
      }),
    ];
  }, []);

  const footerTable = useMemo(() => {
    if (type === 5) {
      const listInc = list.filter((x) => x.type === TypeCatalog.inc);
      const listExp = list.filter((x) => x.type === TypeCatalog.exp);
      const sumInc = listInc.reduce((acc, item) => {
        const p = Number(item?.planned_amount ?? 0);
        return acc + (Number.isFinite(p) ? p : 0);
      }, 0);
      const sumExp = listExp.reduce((acc, item) => {
        const p = Number(item?.planned_amount ?? 0);
        return acc + (Number.isFinite(p) ? p : 0);
      }, 0);
      return {
        sum: sumInc - sumExp,
        title: "Предполагаемый остаток: ",
      };
    } else {
      const sum = list.reduce((acc, item) => {
        const p = Number(item?.planned_amount ?? 0);
        return acc + (Number.isFinite(p) ? p : 0);
      }, 0);
      return {
        sum,
        title: "Сумма: ",
      };
    }
  }, [list, type]);

  if (list.length === 0) return null;

  return (
    <>
      <DataGridTable<myBudgetItem>
        data={list}
        columns={columns}
        getRowId={(row) => row.id}
        enableMultiSelect
        enableColumnResizing
        onEditRow={(row) => {
          dispatch(setCurrentBudget({ id: row.id }));
          dispatch(setToggleForm(true));
        }}
        onDeleteRow={(row) => {
          dispatch(setCurrentBudget({ id: row.id }));
          dispatch(setToggleConfirm(true));
        }}
        onSelectionChange={(selected) => {
          dispatch(setChoosed(null));
          selected.forEach((item) => dispatch(setChoosed(item)));
        }}
        renderFooter={({ gridTemplateColumns }) => (
          <div
            role="row"
            className="grid items-center rounded-2xl border border-primary-700/30 bg-primary-900/25"
            style={{ gridTemplateColumns }}
          >
            <div
              role="cell"
              className="col-span-6 px-4 py-4 text-sm font-semibold text-grey-0"
            >
              {footerTable.title}
            </div>
            <div
              role="cell"
              className="col-span-2 px-4 py-4 text-right text-lg font-bold text-secondary-500 tabular-nums"
            >
              {footerTable.sum.toLocaleString()} ₽
            </div>
          </div>
        )}
      />
    </>
  );
};
