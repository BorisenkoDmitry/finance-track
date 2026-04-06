import { useEffect, useState, type FC } from "react";
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
import { InputField } from "../../../UI/Input/Input";
import { RadioField } from "../../../UI/RadioField/RadioField";
import { SelectField } from "../../../UI/SelectField/SelectField";
import { TextAreaField } from "../../../UI/TextArea/TextArea";
import { normalizeNumberInput } from "../../../../utils/fields";
import { Wallet, Palette, ChevronDown, ChevronUp } from "lucide-react";

interface IBudgetForm {
  isOpen: boolean;
  onClose: () => void;
}

const presetColors = ["#FF7582", "#C56C86", "#725A7A", "#355C7D", "#4ade80", "#fbbf24", "#60a5fa", "#a78bfa"];

export const BudgetForm: FC<IBudgetForm> = ({ isOpen, onClose }) => {
  const {
    currentBudget,
    filters: { type },
  } = useAppSelector((state) => state.budget);
  const dispatch = useAppDispatch();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { listCatalog, selectedCatalog, setCurrentCatalog } = useCatalogSelects(
    currentBudget.type === 5 ? TypeCatalog.exp : currentBudget.type
  );

  const isEdit = currentBudget.id !== "-1";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit) {
      dispatch(createBudgetsApi(currentBudget));
    } else {
      dispatch(editBudgetsApi(currentBudget));
    }
    dispatch(setCurrentBudget(null));
    onClose();
  };

  useEffect(() => {
    if (type === TypeCatalog.exp) {
      dispatch(editBudget({ key: "type", value: TypeCatalog.exp }));
    } else if (type === TypeCatalog.inc) {
      dispatch(editBudget({ key: "type", value: TypeCatalog.inc }));
    }
    // type === 5 ("Все") — не форсируем, оставляем текущий выбор
  }, [type, dispatch]);

  if (!isOpen) return null;

  return createPortal(
    <Popup
      onClose={() => { onClose(); dispatch(setCurrentBudget(null)); }}
      wide={480}
      title={isEdit ? "Редактировать бюджет" : "Новый бюджет"}
      subtitle="Установите лимит расходов или доходов по категории"
      icon={<Wallet size={20} />}
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {/* Category select */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-grey-200/40">
            Категория
          </label>
          <SelectField
            list={listCatalog}
            selected={isEdit ? { label: currentBudget.categoryName, value: currentBudget.catalogId } : selectedCatalog}
            onChange={(v) => {
              dispatch(editBudget({ key: "categoryName", value: v.label }));
              dispatch(editBudget({ key: "catalogId", value: v.value }));
              setCurrentCatalog(v);
            }}
          />
        </div>

        {/* Type toggle */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-grey-200/40">
            Тип
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => dispatch(editBudget({ key: "type", value: TypeCatalog.exp }))}
              className={[
                "flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200",
                currentBudget.type === TypeCatalog.exp
                  ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/25"
                  : "bg-primary-800/30 text-grey-200/50 hover:text-grey-200/70",
              ].join(" ")}
            >
              Расход
            </button>
            <button
              type="button"
              onClick={() => dispatch(editBudget({ key: "type", value: TypeCatalog.inc }))}
              className={[
                "flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200",
                currentBudget.type === TypeCatalog.inc
                  ? "bg-green-500/15 text-green-400 ring-1 ring-green-500/25"
                  : "bg-primary-800/30 text-grey-200/50 hover:text-grey-200/70",
              ].join(" ")}
            >
              Доход
            </button>
          </div>
        </div>

        {/* Amount */}
        <InputField
          value={Number(currentBudget.planned_amount)}
          type="text"
          onChange={(e) => dispatch(editBudget({ key: "planned_amount", value: normalizeNumberInput(e.target.value) }))}
          placeholder="10 000"
          label="Сумма бюджета"
          name="planned_amount"
        />

        {/* Comment */}
        <TextAreaField
          value={currentBudget.comment}
          onChange={(e) => dispatch(editBudget({ key: "comment", value: e.target.value }))}
          placeholder="Заметка к бюджету..."
          label="Примечание"
          name="comment"
        />

        {/* Color */}
        <div>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex w-full items-center justify-between rounded-xl border border-primary-700/15 bg-primary-800/20 px-3 py-2.5 text-xs text-grey-200/60 transition-colors hover:border-primary-700/30"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded" style={{ backgroundColor: currentBudget.color || "#FF7582" }} />
              <span>Цвет графика</span>
            </div>
            {showColorPicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showColorPicker && (
            <div className="mt-2 animate-fade-in">
              {/* Presets */}
              <div className="mb-3 flex gap-1.5">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => dispatch(editBudget({ key: "color", value: c }))}
                    className={[
                      "h-7 w-7 rounded-lg transition-all",
                      currentBudget.color === c ? "ring-2 ring-grey-0/50 scale-110" : "hover:scale-105",
                    ].join(" ")}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <HexColorPicker
                color={currentBudget.color}
                onChange={(x) => dispatch(editBudget({ key: "color", value: x }))}
                style={{ width: "100%", height: "160px" }}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="group relative mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md"
          style={{ background: "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)" }}
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative z-10">{isEdit ? "Сохранить" : "Создать бюджет"}</span>
        </button>
      </form>
    </Popup>,
    document.body
  );
};
