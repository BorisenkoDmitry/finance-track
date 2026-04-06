import {
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";
import {
  setCurrentPlan,
  togglePlannedShutDown,
  type PlanItem,
} from "../../../../../stores/planSlice/planSlice";
import { formatPrice } from "../../../../../utils/parsePrice";
import { Button } from "../../../../UI/Button/Button";
import { PlannedProgressBar } from "../PlannedProgressBar/PlannedProgressBar";
import { DataGridTable } from "../../../../UI/DataGridTable/DataGridTable";
import { EmptyState } from "../../../../UI/EmptyState/EmptyState";

const columnHelper = createColumnHelper<PlanItem>();

export const PlannedListTable = () => {
  const { plansList } = useAppSelector((st) => st.plans);
  const dispatch = useAppDispatch();
  const columns = useMemo(() => {
    return [
      columnHelper.accessor("planName", {
        id: "planName",
        header: "Название",
        cell: (info) => info.getValue(),
        size: 240,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("planDate", {
        id: "planDate",
        header: "Запланированная дата",
        cell: (info) => format(new Date(info.getValue()), "dd-MM-yyyy"),
        size: 220,
        meta: { truncate: true },
      }),
      columnHelper.accessor("planPrice", {
        id: "planPrice",
        header: "Стоимость",
        cell: (info) => formatPrice(info.getValue()),
        size: 200,
        meta: { isNumeric: true, truncate: true },
      }),
      columnHelper.accessor("detailPlans", {
        id: "stay",
        header: "Остаток",
        cell: (info) => {
          const staySum = info
            .getValue()
            .filter((x) => x.isComplete)
            .reduce(
              (sum, next) => sum + (next.planDetailPrice ? next.planDetailPrice : 0),
              0
            );
          const count = info.row.original.planPrice - staySum;
          return count <= 0 ? "План выполнен" : formatPrice(count);
        },
        size: 220,
        meta: { truncate: true, titleFromValue: true },
      }),
      columnHelper.accessor("detailPlans", {
        id: "progress",
        header: "Прогресс",
        cell: (info) => (
          <PlannedProgressBar list={info.getValue()} plan={info.row.original} />
        ),
        size: 360,
      }),
      columnHelper.accessor("planColor", {
        id: "planColor",
        header: "Цвет",
        cell: (info) => (
          <div
            className="h-5 w-5 rounded-full ring-1 ring-primary-700/50"
            style={{ background: info.getValue() }}
          />
        ),
        size: 110,
        meta: { truncate: true },
      }),
    ] satisfies Array<ColumnDef<PlanItem, unknown>>;
  }, []);

  if (plansList.length === 0) return <EmptyState title="Нет планов" subtitle="Добавьте первый финансовый план" />;
  return (
    <DataGridTable<PlanItem>
      data={plansList}
      columns={columns}
      getRowId={(row) => row.id}
      showRowNumber
      enableSorting
      enableColumnResizing
      renderRowActions={(row) => {
        // const staySum = row.detailPlans
        //   .filter((x) => x.isComplete)
        //   .reduce((sum, next) => sum + (next.planDetailPrice ? next.planDetailPrice : 0), 0);
        // const count = row.planPrice - staySum;
        // if (count > 0) return null;
        return (
          <Button
            onClick={() => {
              dispatch(setCurrentPlan(row));
              dispatch(togglePlannedShutDown(true));
            }}
          >
            <RiDeleteBin3Line />
          </Button>
        );
      }}
    />
  );
};
