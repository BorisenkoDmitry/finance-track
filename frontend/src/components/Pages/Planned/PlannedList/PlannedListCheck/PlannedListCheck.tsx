import { format } from "date-fns";
import { useCallback } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";
import {
  getPlansApi,
  onCheckPlanDatailApi,
  setCurrentItemDetail,
  togglePlannedCheckedForm,
  togglePlannedShutDown,
  type PlanDetailItem,
} from "../../../../../stores/planSlice/planSlice";
import { Popup } from "../../../../Layouts/Popup/Popup";
import { Button } from "../../../../UI/Button/Button";
import { InputField } from "../../../../UI/Input/Input";
import { normalizeNumberInput } from "../../../../../utils/fields";

export const PlannedListCheck = () => {
  const dispatch = useAppDispatch();
  const { isPlannedCheckedForm, currentItemDetail, currentItem, plansList } =
    useAppSelector((st) => st.plans);

  const checkSum = useCallback(
    (plansList: PlanDetailItem[]) => {
      const staySum = plansList
        .filter((x) => x.isComplete)
        .reduce(
          (sum, next) =>
            sum + (next.planDetailPrice ? next.planDetailPrice : 0),
          0
        );
      return currentItem.planPrice - staySum;
    },
    [currentItem]
  );

  if (!isPlannedCheckedForm) return null;
  return createPortal(
    <Popup
      onClose={() => {
        dispatch(togglePlannedCheckedForm(false));
        dispatch(setCurrentItemDetail(null));
      }}
      wide={300}
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-[18px]">
          Отложить на <br />
          {format(new Date(currentItemDetail.planDetailDatePay), "dd-MM-yyyy")}
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const newPlanList = currentItem.detailPlans.map((x) => {
              if (x.id === currentItemDetail.id) {
                return { ...currentItemDetail, isComplete: true };
              } else {
                return x;
              }
            });
            if (currentItemDetail.planDetailPrice < 0) {
              return toast.error("Число не может быть отрицательным");
            }
            if (checkSum(newPlanList) < -5) {
              return toast.error(
                "Сумма не может быть больше чем вы запланировали отложить"
              );
            }
            dispatch(
              onCheckPlanDatailApi({
                current: currentItemDetail,
                planId: currentItemDetail.planId,
              })
            ).finally(() => {
              dispatch(getPlansApi()).finally(() => {
                const f = plansList.find((x) => x.id === currentItemDetail.id);
                if (f) {
                  if (f.detailPlans.every((v) => v.isComplete)) {
                    dispatch(togglePlannedShutDown(true));
                  }
                }
                dispatch(togglePlannedCheckedForm(false));
              });
            });
          }}
        >
          <InputField
            value={normalizeNumberInput(currentItemDetail.planDetailPrice)}
            label="Сумма"
            onChange={(v) => {
              dispatch(
                setCurrentItemDetail({
                  ...currentItemDetail,
                  planDetailPrice: Number(v.target.value),
                })
              );
            }}
          />
          <Button>Отложить</Button>
        </form>
      </div>
    </Popup>,
    document.body
  );
};
