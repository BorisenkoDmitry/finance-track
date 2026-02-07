import { useEffect, type FC } from "react";
import { HexColorPicker } from "react-colorful";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { useCatalogSelects } from "../../../../hooks/useCatalogSelects";
import {
  editBudget,
  setCurrentBudget,
} from "../../../../stores/budgetSlice/myBudgetSlice";
import {
  createBudgetsApi,
  editBudgetsApi,
} from "../../../../stores/budgetSlice/myBudgetThunks";
import { TypeCatalog } from "../../../../stores/catalogSlice/catalogsSlice";
import { Popup } from "../../../Layouts/Popup/Popup";
import { Button } from "../../../UI/Button/Button";
import { InputField } from "../../../UI/Input/Input";
import { RadioField } from "../../../UI/RadioField/RadioField";
import { SelectField } from "../../../UI/SelectField/SelectField";
import { TextAreaField } from "../../../UI/TextArea/TextArea";
import { normalizeNumberInput } from "../../../../utils/fields";
import { FieldWrapper } from "../../../Wrappers/FieldWrapper/FieldWrapper";

interface IBudgetForm {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetForm: FC<IBudgetForm> = ({ isOpen, onClose }) => {
  const {
    currentBudget,
    filters: { type },
  } = useAppSelector((state) => state.budget);
  const dispatch = useAppDispatch();

  const { listCatalog, selectedCatalog, setCurrentCatalog } = useCatalogSelects(
    currentBudget.type === 5 ? TypeCatalog.exp : currentBudget.type
  );
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentBudget.id === "-1") {
      dispatch(createBudgetsApi(currentBudget));
      dispatch(setCurrentBudget(null));
    } else {
      dispatch(editBudgetsApi(currentBudget));
      dispatch(setCurrentBudget(null));
    }
    onClose();
  };

  useEffect(() => {
    if (type === TypeCatalog.exp || type === 5) {
      dispatch(
        editBudget({
          key: "type",
          value: TypeCatalog.exp,
        })
      );
    }

    if (type === TypeCatalog.inc) {
      dispatch(
        editBudget({
          key: "type",
          value: TypeCatalog.inc,
        })
      );
    }
  }, [type, dispatch]);

  if (!isOpen) return null;

  return createPortal(
    <Popup
      onClose={() => {
        onClose();
        dispatch(setCurrentBudget(null));
      }}
      wide={800}
    >
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <SelectField
          list={listCatalog}
          selected={currentBudget.id === "-1" ? selectedCatalog : {label: currentBudget.categoryName, value: currentBudget.catalogId}}
          onChange={(v) => {
            dispatch(
              editBudget({
                key: "categoryName",
                value: v.label,
              })
            );
            dispatch(
              editBudget({
                key: "catalogId",
                value: v.value,
              })
            );
            setCurrentCatalog(v);
          }}
        />

        <div className="flex gap-2.5">
          <RadioField
            checked={currentBudget.type === TypeCatalog.exp}
            label="Расход"
            name="incexp"
            onChange={() => {
              dispatch(
                editBudget({
                  key: "type",
                  value: TypeCatalog.exp,
                })
              );
            }}
          />
          <RadioField
            checked={currentBudget.type === TypeCatalog.inc}
            label="Доход"
            name="incexp"
            onChange={() => {
              dispatch(
                editBudget({
                  key: "type",
                  value: TypeCatalog.inc,
                })
              );
            }}
          />
        </div>
        <InputField
          value={Number(currentBudget.planned_amount)}
          type="text"
          onChange={(e) => {
            dispatch(
              editBudget({
                key: "planned_amount",
                value: normalizeNumberInput(e.target.value),
              })
            );
          }}
          placeholder="1200"
          label="Запланированный бюджет"
          name="planned_amount"
        />
        <div className="grid grid-cols-2 gap-2.5">
          <TextAreaField
            value={currentBudget.comment}
            onChange={(e) => {
              dispatch(
                editBudget({
                  key: "comment",
                  value: e.target.value,
                })
              );
            }}
            placeholder="..."
            label="Примечание"
            name="comment"
          />
          <FieldWrapper tagWrapp="div" label="Выбор цвета для графиков">
            <HexColorPicker
              color={currentBudget.color}
              onChange={(x) => {
                dispatch(
                  editBudget({
                    key: "color",
                    value: x,
                  })
                );
              }}
            />
          </FieldWrapper>
        </div>
        <Button className="w-full max-w-[230px] self-end">
          {currentBudget.id === "-1" ? "Создать" : "Сохранить"}
        </Button>
      </form>
    </Popup>,
    document.body
  );
};
