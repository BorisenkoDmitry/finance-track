import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";

import { setCurrentInc, toggleConfirm } from "../../../../../stores/incSlice/incSlice";
import { deleteIncApi } from "../../../../../stores/incSlice/incThunks";
import { Confirm } from "../../../../UI/Confirm/Confirm";

export const IncConfirm = () => {
  const { isOpenConfirm, currentInc } = useAppSelector((state) => state.Inc);
  const dispatch = useAppDispatch();
  if (!isOpenConfirm) return null;
  return (
    <Confirm
      text={`Вы точно хотите удалить доход с id ${currentInc.id}?`}
      onClose={() => {
        dispatch(setCurrentInc(null));
        dispatch(toggleConfirm(false));
      }}
      onCancel={() => {
        dispatch(setCurrentInc(null));
        dispatch(toggleConfirm(false));
      }}
      onSuccess={() => {
        dispatch(deleteIncApi(currentInc.id));
        dispatch(toggleConfirm(false));
      }}
    />
  );
};
