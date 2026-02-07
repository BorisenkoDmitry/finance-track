import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";
import { setCurrentExp, toggleConfirm } from "../../../../../stores/expSlice/expSlice";
import { deleteExpApi } from "../../../../../stores/expSlice/expThunks";
import { Confirm } from "../../../../UI/Confirm/Confirm";

export const ExpConfirm = () => {
  const { isOpenConfirm, currentExp } = useAppSelector((state) => state.expInc);
  const dispatch = useAppDispatch();
  if (!isOpenConfirm) return null;
  return (
    <Confirm
      text={`Вы точно хотите удалить расход с id ${currentExp.id}?`}
      onClose={() => {
        dispatch(setCurrentExp(null));
        dispatch(toggleConfirm(false));
      }}
      onCancel={() => {
        dispatch(setCurrentExp(null));
        dispatch(toggleConfirm(false));
      }}
      onSuccess={() => {
        dispatch(deleteExpApi(currentExp));
        dispatch(toggleConfirm(false));
      }}
    />
  );
};
