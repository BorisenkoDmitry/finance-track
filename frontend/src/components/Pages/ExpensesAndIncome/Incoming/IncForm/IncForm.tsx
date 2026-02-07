import { type FC } from "react";
import { createPortal } from "react-dom";
import { Popup } from "../../../../Layouts/Popup/Popup";
import { InputField } from "../../../../UI/Input/Input";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";

import {
  getEmptyIncReducer,
  onChangeFieldsInc,
  toggleIncForm,
} from "../../../../../stores/incSlice/incSlice";
import {
  createIncApi,
  updateIncApi,
} from "../../../../../stores/incSlice/incThunks";
import {
  formatNumber,
  normalizeNumberInput,
} from "../../../../../utils/fields";
import { Button } from "../../../../UI/Button/Button";
import { DateField } from "../../../../UI/DateField/DateField";
import { SelectField } from "../../../../UI/SelectField/SelectField";
import { TextAreaField } from "../../../../UI/TextArea/TextArea";

export const IncForm: FC = () => {
  const {
    Inc: { currentInc, isOpenIncForm },
    catalogs: {
      sourceIncList: catList,
      methodInc: methodList,
      typeInc: typeList,
    },
  } = useAppSelector((st) => st);
  const dispatch = useAppDispatch();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentInc.id === "-1") {
      dispatch(createIncApi(currentInc));
    } else {
      dispatch(updateIncApi(currentInc));
    }

    dispatch(toggleIncForm(false));
    dispatch(
      getEmptyIncReducer({
        method: undefined,
        source: undefined,
        typeInc: undefined,
      })
    );
  };

  if (!isOpenIncForm) return null;

  return createPortal(
    <Popup
      onClose={() => {
        dispatch(toggleIncForm(false));
        dispatch(
          getEmptyIncReducer({
            method: undefined,
            source: undefined,
            typeInc: undefined,
          })
        );
      }}
      wide={800}
      height="90vh"
    >
      <form className="flex max-h-[90vh] flex-col gap-5 overflow-auto" onSubmit={onSubmit}>
        <InputField
          value={formatNumber(currentInc.sum)}
          type="text"
          onChange={(e) => {
            dispatch(
              onChangeFieldsInc({
                key: "sum",
                value: normalizeNumberInput(e.target.value),
              })
            );
          }}
          placeholder="1200"
          label="Цена"
          name="spended"
        />
        <TextAreaField
          value={currentInc.description}
          onChange={(e) => {
            dispatch(
              onChangeFieldsInc({
                key: "description",
                value: String(e.target.value),
              })
            );
          }}
          placeholder="Интересный проект по созданию..."
          label="Описание дохода / детали"
          name="description"
        />

        <SelectField
          label="Источники"
          selected={catList.find((x) => x.label === currentInc.source)}
          list={catList}
          onChange={(v) => {
            dispatch(
              onChangeFieldsInc({
                key: "source",
                value: v?.label ? v.label : "",
              })
            );
          }}
        />

        <SelectField
          label="Способ оплаты"
          selected={methodList.find((x) => x.label === currentInc.method)}
          list={methodList}
          onChange={(v) => {
            dispatch(
              onChangeFieldsInc({
                key: "method",
                value: v?.label ? v.label : "",
              })
            );
          }}
        />

        <SelectField
          label="Тип дохода"
          selected={typeList.find((x) => x.label === currentInc.typeInc)}
          list={typeList}
          onChange={(v) => {
            dispatch(
              onChangeFieldsInc({
                key: "typeInc",
                value: v?.label ? v.label : "",
              })
            );
          }}
        />

        <DateField
          isTimeOn
          label="Дата создания"
          selected={new Date(currentInc.date)}
          onChange={(date) => {
            if (date) {
              dispatch(
                onChangeFieldsInc({
                  key: "date",
                  value: date.toISOString(),
                })
              );
            }
          }}
        />
        <Button className="self-start">
          {currentInc.id === "-1" ? "Создать" : "Сохранить"}
        </Button>
      </form>
    </Popup>,
    document.body
  );
};
