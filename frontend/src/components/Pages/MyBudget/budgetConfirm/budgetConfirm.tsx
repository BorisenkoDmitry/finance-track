import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";

import {
  setCurrentBudget,
  setToggleConfirm,
} from "../../../../stores/budgetSlice/myBudgetSlice";
import { deleteBudgetsApi } from "../../../../stores/budgetSlice/myBudgetThunks";
import { Confirm } from "../../../UI/Confirm/Confirm";

export const BudgetConfirm = () => {
  const { currentBudget, isOpenConfirm } = useAppSelector(
    (state) => state.budget
  );
  const dispatch = useAppDispatch();
  if (!isOpenConfirm) return null;
  return (
    <Confirm
      text={`Вы точно хотите удалить бюджет с id ${currentBudget.id}?`}
      onClose={() => {
        dispatch(setCurrentBudget(null));
        dispatch(setToggleConfirm(false));
      }}
      onCancel={() => {
        dispatch(setCurrentBudget(null));
        dispatch(setToggleConfirm(false));
      }}
      onSuccess={() => {
        dispatch(deleteBudgetsApi({ id: currentBudget.id }));
        dispatch(setToggleConfirm(false));
        dispatch(setCurrentBudget(null));
      }}
    />
  );
};
