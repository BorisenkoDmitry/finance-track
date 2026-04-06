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
import { DateField } from "../../../../UI/DateField/DateField";
import { SelectField } from "../../../../UI/SelectField/SelectField";
import { TextAreaField } from "../../../../UI/TextArea/TextArea";
import { TrendingUp } from "lucide-react";

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

  const isEdit = currentInc.id !== "-1";

  const onClose = () => {
    dispatch(toggleIncForm(false));
    dispatch(getEmptyIncReducer({ method: undefined, source: undefined, typeInc: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit) {
      dispatch(createIncApi(currentInc));
    } else {
      dispatch(updateIncApi(currentInc));
    }
    onClose();
  };

  if (!isOpenIncForm) return null;

  return createPortal(
    <Popup
      onClose={onClose}
      wide={480}
      title={isEdit ? "Редактировать доход" : "Новый доход"}
      subtitle="Добавьте информацию о поступлении средств"
      icon={<TrendingUp size={20} />}
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {/* Amount */}
        <InputField
          value={formatNumber(currentInc.sum)}
          type="text"
          onChange={(e) =>
            dispatch(onChangeFieldsInc({ key: "sum", value: normalizeNumberInput(e.target.value) }))
          }
          placeholder="50 000"
          label="Сумма"
          name="spended"
        />

        {/* Description */}
        <TextAreaField
          value={currentInc.description}
          onChange={(e) =>
            dispatch(onChangeFieldsInc({ key: "description", value: String(e.target.value) }))
          }
          placeholder="Зарплата, фриланс, подработка..."
          label="Описание дохода"
          name="description"
        />

        {/* Source */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-grey-200/40">
            Источник
          </label>
          <SelectField
            selected={catList.find((x) => x?.label === currentInc.source)}
            list={catList}
            onChange={(v) =>
              dispatch(onChangeFieldsInc({ key: "source", value: v?.label ?? "" }))
            }
          />
        </div>

        {/* Method */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-grey-200/40">
            Способ оплаты
          </label>
          <SelectField
            selected={methodList.find((x) => x?.label === currentInc.method)}
            list={methodList}
            onChange={(v) =>
              dispatch(onChangeFieldsInc({ key: "method", value: v?.label ?? "" }))
            }
          />
        </div>

        {/* Type */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-grey-200/40">
            Тип дохода
          </label>
          <SelectField
            selected={typeList.find((x) => x?.label === currentInc.typeInc)}
            list={typeList}
            onChange={(v) =>
              dispatch(onChangeFieldsInc({ key: "typeInc", value: v?.label ?? "" }))
            }
          />
        </div>

        {/* Date */}
        <DateField
          isTimeOn
          label="Дата"
          selected={new Date(currentInc.date)}
          onChange={(date) => {
            if (date) dispatch(onChangeFieldsInc({ key: "date", value: date.toISOString() }));
          }}
        />

        {/* Submit */}
        <button
          type="submit"
          className="group relative mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md"
          style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #355C7D 100%)" }}
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative z-10">{isEdit ? "Сохранить" : "Создать доход"}</span>
        </button>
      </form>
    </Popup>,
    document.body
  );
};
