import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, ChevronDown, ChevronUp, ShoppingCart, Package } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../hooks/storeHook";
import {
  onChangeFieldsExp,
  type ExpDetailItem,
} from "../../../../../../stores/expSlice/expSlice";
import {
  createExpDetailApi,
  deleteExpDetailApi,
  updateExpDetailApi,
} from "../../../../../../stores/expSlice/expThunks";
import { normalizeNumberInput } from "../../../../../../utils/fields";

export const ExpDetail = () => {
  const {
    currentExp: { products, id: expID },
    isNewExp,
  } = useAppSelector((state) => state.expInc);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(products.length > 0);

  const isNewRecord = isNewExp || expID === "-1";

  // Auto-sum products → price
  useEffect(() => {
    if (products.length > 0) {
      dispatch(
        onChangeFieldsExp({
          key: "price",
          value: products.reduce((acc, item) => {
            const p = Number(item?.price ?? 0);
            return acc + (Number.isFinite(p) ? p : 0);
          }, 0),
        })
      );
    }
  }, [products, dispatch]);

  const addProduct = () => {
    if (isNewRecord) {
      // Local-only: add to redux state without API call
      dispatch(
        onChangeFieldsExp({
          key: "products",
          value: [
            ...products,
            {
              id: `local-${Date.now()}`,
              name: "",
              price: 0,
              count: "",
              expID: "",
              isEdit: true,
            },
          ],
        })
      );
    } else {
      // Existing expense: create via API
      dispatch(
        createExpDetailApi({
          expID,
          expDetail: { name: "", price: 0, count: "", isEdit: true, expID: "" },
        })
      );
    }
    setIsOpen(true);
  };

  const changeProduct = (
    id: string,
    key: keyof ExpDetailItem,
    value: string | number | boolean
  ) => {
    dispatch(
      onChangeFieldsExp({
        key: "products",
        value: products.map((item) =>
          item.id === id ? { ...item, [key]: value } : item
        ),
      })
    );
  };

  const deleteProduct = (id: string) => {
    if (!isNewRecord && !id.startsWith("local-")) {
      dispatch(deleteExpDetailApi({ id, expID })).finally(() => {
        dispatch(
          onChangeFieldsExp({
            key: "products",
            value: products.filter((item) => item.id !== id),
          })
        );
        toast.success("Товар удалён");
      });
    } else {
      dispatch(
        onChangeFieldsExp({
          key: "products",
          value: products.filter((item) => item.id !== id),
        })
      );
    }
  };

  const saveProduct = (id: string) => {
    if (!isNewRecord && !id.startsWith("local-")) {
      const expDetail = products.find((p) => p.id === id);
      if (expDetail) {
        dispatch(updateExpDetailApi({ expID, ...expDetail })).finally(() => {
          changeProduct(id, "isEdit", false);
        });
      }
    } else {
      changeProduct(id, "isEdit", false);
    }
  };

  return (
    <div>
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-primary-700/15 bg-primary-800/20 px-3 py-2.5 text-xs text-grey-200/60 transition-colors hover:border-primary-700/30"
      >
        <div className="flex items-center gap-2">
          <ShoppingCart size={14} className="text-grey-200/40" />
          <span>Товары</span>
          {products.length > 0 && (
            <span className="rounded-full bg-primary-500/15 px-2 py-0.5 text-[10px] font-semibold text-primary-400">
              {products.length}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Products list */}
      {isOpen && (
        <div className="mt-2 animate-fade-in">
          {products.length > 0 && (
            <div className="custom-scrollbar max-h-[280px] space-y-2 overflow-y-auto rounded-xl border border-primary-700/15 bg-primary-900/20 p-2">
              {products.map((item) => (
                <ProductRow
                  key={item.id}
                  item={item}
                  onChange={changeProduct}
                  onDelete={() => deleteProduct(item.id)}
                  onSave={() => saveProduct(item.id)}
                />
              ))}
            </div>
          )}

          {/* Add button */}
          <button
            type="button"
            onClick={addProduct}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary-700/25 py-2.5 text-xs text-grey-200/50 transition-all duration-200 hover:border-primary-500/40 hover:bg-primary-500/5 hover:text-primary-400"
          >
            <Plus size={14} />
            Добавить товар
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Product Row ─── */
const ProductRow = ({
  item,
  onChange,
  onDelete,
  onSave,
}: {
  item: ExpDetailItem;
  onChange: (id: string, key: keyof ExpDetailItem, value: string | number | boolean) => void;
  onDelete: () => void;
  onSave: () => void;
}) => {
  if (!item.isEdit) {
    // Read-only view
    return (
      <div
        className="group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary-700/10 cursor-pointer"
        onClick={() => onChange(item.id, "isEdit", true)}
      >
        <Package size={13} className="shrink-0 text-grey-200/30" />
        <span className="flex-1 truncate text-sm text-grey-100">{item.name || "Без названия"}</span>
        <span className="shrink-0 text-xs text-grey-200/50">{item.count}</span>
        <span className="shrink-0 text-sm font-medium tabular-nums text-grey-0">
          {Number(item.price).toLocaleString()} ₽
        </span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-grey-200/40 hover:text-red-400"
        >
          <Trash2 size={13} />
        </button>
      </div>
    );
  }

  // Edit view
  return (
    <div className="rounded-xl border border-primary-700/20 bg-primary-800/15 p-3 animate-fade-in">
      <div className="flex flex-col gap-2">
        <input
          autoFocus
          type="text"
          placeholder="Название товара"
          value={item.name}
          onChange={(e) => onChange(item.id, "name", e.target.value)}
          className="app-input py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Кол-во / вес"
            value={item.count}
            onChange={(e) => onChange(item.id, "count", e.target.value)}
            className="app-input flex-1 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Цена"
            value={item.price || ""}
            onChange={(e) => onChange(item.id, "price", normalizeNumberInput(e.target.value))}
            className="app-input flex-1 py-2 text-sm"
          />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-grey-200/40 transition-colors hover:text-red-400"
        >
          Удалить
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-primary-500/20 px-4 py-1.5 text-xs font-semibold text-primary-400 transition-all hover:bg-primary-500/30"
        >
          Готово
        </button>
      </div>
    </div>
  );
};
