import { useEffect, type FC } from "react";
import { createPortal } from "react-dom";
import { Popup } from "../../../../Layouts/Popup/Popup";
import { InputField } from "../../../../UI/Input/Input";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";
import {
  getEmptyExp,
  onChangeFieldsExp,
  setCurrentExp,
  setIsNewExp,
  toggleExpForm,
} from "../../../../../stores/expSlice/expSlice";
import {
  createExpApi,
  deleteExpApi,
  updateExpApi,
} from "../../../../../stores/expSlice/expThunks";
import {
  formatNumber,
  normalizeNumberInput,
} from "../../../../../utils/fields";
import { Button } from "../../../../UI/Button/Button";
import { DateField } from "../../../../UI/DateField/DateField";
import { SelectField } from "../../../../UI/SelectField/SelectField";
import { TextAreaField } from "../../../../UI/TextArea/TextArea";
import { ExpDetail } from "./ExpDetail/ExpDetail";

export const ExpForm: FC = () => {
  const {
    expInc: { currentExp, isOpenExpForm, isNewExp, onlyCreate },
    catalogs: { categoryExpList: catList },
  } = useAppSelector((st) => st);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentExp.id === "-1" && isOpenExpForm && !onlyCreate) {
      dispatch(createExpApi(getEmptyExp()));
    }
  }, [currentExp.id, isOpenExpForm, dispatch, onlyCreate]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onlyCreate) {
      dispatch(createExpApi(currentExp));
    } else {
      if (isNewExp) {
        dispatch(updateExpApi(currentExp));
      } else {
        dispatch(updateExpApi(currentExp));
      }
    }

    dispatch(toggleExpForm(false));
    dispatch(setCurrentExp(null));
    dispatch(setIsNewExp(false));
  };

  if (!isOpenExpForm) return null;

  return createPortal(
    <Popup
      onClose={() => {
        if (isNewExp && !onlyCreate) {
          dispatch(deleteExpApi(currentExp));
        }
        dispatch(toggleExpForm(false));
        dispatch(setCurrentExp(null));
        dispatch(setIsNewExp(false));
      }}
      wide={800}
      height="90vh"
    >
      <form className="flex max-h-[90vh] flex-col gap-5 overflow-auto" onSubmit={onSubmit}>
        <InputField
          value={formatNumber(currentExp.price)}
          type="text"
          onChange={(e) => {
            dispatch(
              onChangeFieldsExp({
                key: "price",
                value: normalizeNumberInput(e.target.value),
              })
            );
          }}
          placeholder="1200"
          label="Цена"
          name="spended"
          disabled={currentExp.products.length > 0}
        />
        <TextAreaField
          value={currentExp.descr}
          onChange={(e) => {
            dispatch(
              onChangeFieldsExp({
                key: "descr",
                value: String(e.target.value),
              })
            );
          }}
          placeholder="Куплено в пятёрочке..."
          label="Описание расхода"
          name="description"
        />
        <ExpDetail />
        <SelectField
          label="Категория"
          selected={catList.find((x) => x.value === currentExp.catalogId)}
          list={catList}
          onChange={(v) => {
            dispatch(
              onChangeFieldsExp({
                key: "catalogId",
                value: v?.value ? v.value : null,
              })
            );
          }}
        />
        <DateField
          isTimeOn
          label="Дата создания"
          selected={new Date(currentExp.date)}
          onChange={(date) => {
            if (date) {
              dispatch(
                onChangeFieldsExp({
                  key: "date",
                  value: date.toISOString(),
                })
              );
            }
          }}
        />
        <Button className="self-start">
          {currentExp.id === "-1" ? "Создать" : "Сохранить"}
        </Button>
      </form>
    </Popup>,
    document.body
  );
};
