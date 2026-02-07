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

const columnHelper = createColumnHelper<IncItem>();

export const IncTable: FC = () => {
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
        header: () => (
          <span className={key === "source" ? "text-secondary-500" : undefined}>
            Источник
          </span>
        ),
        cell: (info) => info.getValue(),
        size: 220,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("date", {
        id: "date",
        header: () => (
          <span className={key === "date" ? "text-secondary-500" : undefined}>
            Дата создания
          </span>
        ),
        cell: (info) => parseDate.toString(new Date(info.getValue())),
        size: 220,
        meta: { truncate: true },
      }),
      columnHelper.accessor("description", {
        id: "description",
        header: () => (
          <span className={key === "description" ? "text-secondary-500" : undefined}>
            Описание дохода / детали
          </span>
        ),
        cell: (info) => <span className="whitespace-normal break-words">{info.getValue()}</span>,
        size: 520,
        meta: { titleFromValue: true },
      }),
      columnHelper.accessor("method", {
        id: "method",
        header: () => (
          <span className={key === "method" ? "text-secondary-500" : undefined}>
            Способ оплаты
          </span>
        ),
        cell: (info) => <span>{info.getValue()}</span>,
        size: 220,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("typeInc", {
        id: "typeInc",
        header: () => (
          <span className={key === "typeInc" ? "text-secondary-500" : undefined}>
            Тип дохода
          </span>
        ),
        cell: (info) => <span>{info.getValue()}</span>,
        size: 220,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("sum", {
        id: "sum",
        header: () => (
          <span className={key === "sum" ? "text-secondary-500" : undefined}>Доход</span>
        ),
        cell: (info) => Number(info.getValue()).toLocaleString() + ` ₽`,
        size: 180,
        meta: { isNumeric: true, truncate: true },
      }),
    ] satisfies Array<ColumnDef<IncItem, unknown>>;
  }, [key]);

  const sumCount = useMemo(() => {
    return incList.reduce((acc, item) => {
      const p = Number(item?.sum ?? 0);
      return acc + (Number.isFinite(p) ? p : 0);
    }, 0);
  }, [incList]);

  if (incList.length === 0) return null;

  return (
    <>
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
        renderFooter={({ table, gridTemplateColumns }) => {
          const leafCols = table.getVisibleLeafColumns();
          const sumIdx = leafCols.findIndex((c) => c.id === "sum");
          return (
            <div
              role="row"
              className="grid items-center rounded-2xl border border-primary-700/30 bg-primary-900/25"
              style={{ gridTemplateColumns }}
            >
              {leafCols.map((c, idx) => {
                const isSum = idx === sumIdx;
                return (
                  <div
                    role="cell"
                    key={`footer_${c.id}`}
                    className={[
                      "px-4 py-3.5 text-sm",
                      idx === 0 ? "font-semibold text-grey-0" : "text-grey-200",
                      isSum ? "font-bold tabular-nums text-grey-0" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {idx === 0 ? "Сумма доходов:" : isSum ? `${sumCount.toLocaleString()} ₽` : ""}
                  </div>
                );
              })}
            </div>
          );
        }}
      />
    </>
  );
};
