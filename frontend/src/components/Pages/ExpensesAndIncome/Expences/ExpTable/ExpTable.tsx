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

export const ExpTable: FC = () => {
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

  // const filteredArray = useMemo(() => {
  //   let arr: ExpItem[] = [];
  //   if (value.length > 0) {
  //     arr = exp.filter((x) => {
  //       return (
  //         String(x[key]).toLocaleLowerCase().includes(value.toLowerCase()) &&
  //         new Date(start).getTime() <= parseDate.toDate(x.date).getTime() &&
  //         parseDate.toDate(x.date).getTime() <= new Date(end).getTime()
  //       );
  //     });
  //   } else {
  //     arr = exp.filter((x) => {
  //       return (
  //         new Date(start).getTime() <= parseDate.toDate(x.date).getTime() &&
  //         parseDate.toDate(x.date).getTime() <= new Date(end).getTime()
  //       );
  //     });
  //   }
  //   return arr;
  // }, [exp, key, value, start, end]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("categoryName", {
        id: "categoryName",
        header: () => (
          <span className={key === "categoryName" ? "text-secondary-500" : undefined}>
            Категория
          </span>
        ),
        cell: (info) => info.getValue(),
        size: 240,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("date", {
        id: "date",
        header: () => (
          <span className={key === "date" ? "text-secondary-500" : undefined}>Дата</span>
        ),
        cell: (info) => parseDate.toString(new Date(info.getValue())),
        size: 220,
        meta: { truncate: true },
      }),
      columnHelper.accessor("descr", {
        id: "descr",
        header: () => (
          <span className={key === "descr" ? "text-secondary-500" : undefined}>
            Описание
          </span>
        ),
        cell: (info) => <span className="whitespace-normal break-words">{info.getValue()}</span>,
        size: 520,
        meta: { titleFromValue: true },
      }),
      columnHelper.accessor("price", {
        id: "price",
        header: () => (
          <span className={key === "price" ? "text-secondary-500" : undefined}>Цена</span>
        ),
        cell: (info) => Number(info.getValue()).toLocaleString() + ` ₽`,
        size: 190,
        meta: { isNumeric: true, truncate: true },
      }),
    ] satisfies Array<ColumnDef<ExpItem, unknown>>;
  }, [key]);

  const [openProductsById, setOpenProductsById] = useState<Record<string, boolean>>({});

  const sumCount = useMemo(() => {
    return exp.reduce((acc, item) => {
      const p = Number(item?.price ?? 0);
      return acc + (Number.isFinite(p) ? p : 0);
    }, 0);
  }, [exp]);

  if (exp.length === 0) return null;

  return (
    <>
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
          if (!isOpen) return null;
          if (!row.products || row.products.length === 0) return null;
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
        renderFooter={({ table, gridTemplateColumns }) => {
          const leafCols = table.getVisibleLeafColumns();
          const priceIdx = leafCols.findIndex((c) => c.id === "price");
          return (
            <div
              role="row"
              className="grid items-center rounded-2xl border border-primary-700/30 bg-primary-900/25"
              style={{ gridTemplateColumns }}
            >
              {leafCols.map((c, idx) => {
                const isPrice = idx === priceIdx;
                return (
                  <div
                    role="cell"
                    key={`footer_${c.id}`}
                    className={[
                      "px-4 py-3.5 text-sm",
                      idx === 0 ? "font-semibold text-grey-0" : "text-grey-200",
                      isPrice ? "font-bold tabular-nums text-grey-0" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {idx === 0 ? "Сумма:" : isPrice ? `${sumCount.toLocaleString()} ₽` : ""}
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
