import { useRef, useState, type FC } from "react";
import { createPortal } from "react-dom";
import { Popup } from "../../../../Layouts/Popup/Popup";
import { InputField } from "../../../../UI/Input/Input";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storeHook";
import {
  onChangeFieldsExp,
  setCurrentExp,
  setIsNewExp,
  toggleExpForm,
} from "../../../../../stores/expSlice/expSlice";
import {
  createExpApi,
  createExpDetailApi,
  updateExpApi,
} from "../../../../../stores/expSlice/expThunks";
import type { AppDispatch } from "../../../../../stores/store";
import {
  formatNumber,
  normalizeNumberInput,
} from "../../../../../utils/fields";
import { DateField } from "../../../../UI/DateField/DateField";
import { SelectField } from "../../../../UI/SelectField/SelectField";
import { TextAreaField } from "../../../../UI/TextArea/TextArea";
import { ExpDetail } from "./ExpDetail/ExpDetail";
import { TrendingDown, Camera, Loader2 } from "lucide-react";
import api from "../../../../../Api/api";
import toast from "react-hot-toast";

export const ExpForm: FC = () => {
  const {
    expInc: { currentExp, isOpenExpForm, isNewExp },
    catalogs: { categoryExpList: catList },
    user: { user },
  } = useAppSelector((st) => st);

  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  const isEdit = !isNewExp && currentExp.id !== "-1";
  const isSuperAdmin = user?.user?.roles?.some((r) => r.name === "SuperAdmin" || r.name === "BetaUser");

  const onClose = () => {
    dispatch(toggleExpForm(false));
    dispatch(setCurrentExp(null));
    dispatch(setIsNewExp(false));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(updateExpApi(currentExp));
    } else {
      const localProducts = currentExp.products.filter((p) => p.id.startsWith("local-"));
      const result = await (dispatch as AppDispatch)(createExpApi(currentExp));
      if (createExpApi.fulfilled.match(result) && localProducts.length > 0) {
        const newExpID = result.payload.id;
        await Promise.all(
          localProducts.map((p) =>
            (dispatch as AppDispatch)(
              createExpDetailApi({
                expID: newExpID,
                expDetail: { name: p.name, price: p.price, count: p.count, isEdit: false, expID: "" },
              })
            )
          )
        );
      }
    }
    onClose();
  };

  const handleScanReceipt = async (file: File) => {
    setIsScanning(true);
    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:image/...;base64, prefix
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await api.post("exp/scan-receipt", { image: base64 });
      const data = res.data as { products: { name: string; price: number; count: string }[]; total: number };

      if (!data.products || data.products.length === 0) {
        toast.error("Не удалось распознать товары на чеке");
        return;
      }

      // Fill products into form
      const newProducts = data.products.map((p, i) => ({
        id: `local-scan-${Date.now()}-${i}`,
        name: p.name,
        price: p.price,
        count: p.count,
        expID: "",
        isEdit: false,
      }));

      dispatch(onChangeFieldsExp({ key: "products", value: [...currentExp.products, ...newProducts] }));
      dispatch(onChangeFieldsExp({ key: "price", value: data.total || data.products.reduce((s, p) => s + p.price, 0) }));

      toast.success(`Распознано ${data.products.length} товаров`);
    } catch (err) {
      toast.error("Ошибка при сканировании чека");
      console.error(err);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isOpenExpForm) return null;

  return createPortal(
    <Popup
      onClose={onClose}
      wide={480}
      title={isEdit ? "Редактировать расход" : "Новый расход"}
      subtitle="Добавьте информацию о трате"
      icon={<TrendingDown size={20} />}
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {/* Scan receipt button — only for SuperAdmin/BetaUser */}
        {isSuperAdmin && !isEdit && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleScanReceipt(file);
              }}
            />
            <button
              type="button"
              disabled={isScanning}
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-secondary-500/30 bg-secondary-500/5 py-3 text-sm font-medium text-secondary-400 transition-all hover:border-secondary-500/50 hover:bg-secondary-500/10 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Распознаём чек...
                </>
              ) : (
                <>
                  <Camera size={16} />
                  Сканировать чек
                </>
              )}
            </button>
          </>
        )}

        {/* Amount */}
        <InputField
          value={formatNumber(currentExp.price)}
          type="text"
          onChange={(e) =>
            dispatch(onChangeFieldsExp({ key: "price", value: normalizeNumberInput(e.target.value) }))
          }
          placeholder="1 200"
          label="Сумма"
          name="spended"
          disabled={currentExp.products.length > 0}
        />

        {/* Description */}
        <TextAreaField
          value={currentExp.descr}
          onChange={(e) =>
            dispatch(onChangeFieldsExp({ key: "descr", value: String(e.target.value) }))
          }
          placeholder="Куплено в пятёрочке..."
          label="Описание расхода"
          name="description"
        />

        {/* Products detail */}
        <ExpDetail />

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-grey-200/40">
            Категория
          </label>
          <SelectField
            selected={catList.find((x) => x?.value === currentExp.catalogId)}
            list={catList}
            onChange={(v) =>
              dispatch(onChangeFieldsExp({ key: "catalogId", value: v?.value ?? null }))
            }
          />
        </div>

        {/* Date */}
        <DateField
          isTimeOn
          label="Дата"
          selected={new Date(currentExp.date)}
          onChange={(date) => {
            if (date) dispatch(onChangeFieldsExp({ key: "date", value: date.toISOString() }));
          }}
        />

        {/* Submit */}
        <button
          type="submit"
          className="group relative mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md"
          style={{ background: "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)" }}
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative z-10">{isEdit ? "Сохранить" : "Создать расход"}</span>
        </button>
      </form>
    </Popup>,
    document.body
  );
};
