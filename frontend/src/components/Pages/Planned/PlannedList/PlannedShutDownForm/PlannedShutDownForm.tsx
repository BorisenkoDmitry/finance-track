import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";
import {
  getEmptyExp,
  setCurrentExpFull,
  setIsNewExp,
  setOnlyCreate,
  toggleExpForm,
  type ExpItem
} from "../../../../../stores/expSlice/expSlice";
import {
  deletePlanApi,
  getPlansApi,
  togglePlannedShutDown,
} from "../../../../../stores/planSlice/planSlice";
import { Popup } from "../../../../Layouts/Popup/Popup";
import { Button } from "../../../../UI/Button/Button";

export const PlannedShutDownPopup = () => {
  const dispatch = useAppDispatch();
  const { isOpenShutDownPlan, currentItem } = useAppSelector((st) => st.plans);

  if (!isOpenShutDownPlan) return null;
  return createPortal(
    <Popup
      onClose={() => {
        dispatch(togglePlannedShutDown(false));
      }}
      wide={500}
    >
      <h2 className="text-center text-base">
        Вы отложили нужную сумму, хотите удалить план и внести его в расход?
      </h2>
      <div className="flex items-center gap-4">
        <Button
          className="flex-1"
          onClick={() => {
            if (currentItem === null) {
              toast.error(
                `Данный план не может быть удалён. Обратитесь в поддержку`
              );
            } else {
              dispatch(deletePlanApi(currentItem.id)).finally(() => {
                const obj: ExpItem = {
                  ...getEmptyExp(),
                  price: parseFloat(currentItem.planPrice),
                  date: currentItem.planDate,
                  descr: currentItem.planName,
                };
                dispatch(setIsNewExp(true));
                dispatch(setOnlyCreate(true));
                dispatch(toggleExpForm(true));

                dispatch(setCurrentExpFull(obj));
                dispatch(togglePlannedShutDown(false));
                dispatch(getPlansApi());
              });
            }
          }}
        >
          Да
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            dispatch(togglePlannedShutDown(false));
          }}
        >
          Нет
        </Button>
      </div>
    </Popup>,
    document.body
  );
};
