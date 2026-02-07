import { useMemo, type FC } from "react";
import {
  setCurrentItemDetail,
  setCurrentPlan,
  togglePlannedCheckedForm,
  type PlanDetailItem,
  type PlanItem,
} from "../../../../../stores/planSlice/planSlice";
import Tippy from "@tippyjs/react";
import { normalizeNumberInput } from "../../../../../utils/fields";
import { format } from "date-fns";
import { FaCheck } from "react-icons/fa6";
import { useAppDispatch } from "../../../../../hooks/storeHook";

interface IPlannedProgressBar {
  list: PlanDetailItem[];
  plan: PlanItem;
}

export const PlannedProgressBar: FC<IPlannedProgressBar> = ({ list, plan }) => {
  const dispatch = useAppDispatch();
  const proc = useMemo(() => {
    const nl = list
      .filter((item) => item.isComplete)
      .reduce(
        (sum, next) => sum + (next.planDetailPrice ? next.planDetailPrice : 0),
        0
      );

    return Number(((nl / plan.planPrice) * 100).toFixed(2));
  }, [list, plan]);
  return (
    <div className="relative flex min-h-[50px] overflow-hidden rounded-[10px]">
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/20 text-base text-grey-0 opacity-20">
        {proc}%
      </div>
      {list.map((planDetail) => {
        return (
          <Tippy
            key={planDetail.id}
            className={planDetail.isComplete ? "bg-[#45c28b]" : ""}
            content={
              <div>
                {!planDetail.isComplete ? (
                  <>
                    <p>
                      <b>Отложить: </b>
                      {normalizeNumberInput(planDetail.planDetailPrice)} ₽
                    </p>
                    <p>
                      До{" "}
                      {format(
                        new Date(planDetail.planDetailDatePay),
                        "dd-MM-yyyy"
                      )}
                    </p>
                  </>
                ) : (
                  <p>
                    <b>Отложено: </b>
                    {normalizeNumberInput(planDetail.planDetailPrice)} ₽
                  </p>
                )}
              </div>
            }
          >
            <div
              className="group relative flex-1 border-r border-primary-700/40 transition-opacity hover:opacity-80"
              style={{
                background: planDetail.isComplete ? "#45c28b" : "#e08686",
              }}
              onClick={() => {
                if (!planDetail.isComplete) {
                  dispatch(setCurrentPlan(plan));
                  dispatch(setCurrentItemDetail(planDetail));
                  dispatch(togglePlannedCheckedForm(true));
                }
              }}
            >
              <FaCheck className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-grey-0 opacity-0 group-hover:opacity-100" />
            </div>
          </Tippy>
        );
      })}
    </div>
  );
};
