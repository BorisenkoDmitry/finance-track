import { useEffect } from "react";
import toast from "react-hot-toast";
import { LuSave } from "react-icons/lu";
import { RiDeleteBin3Line, RiEdit2Line } from "react-icons/ri";
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
import { Button } from "../../../../../UI/Button/Button";
import { InputField } from "../../../../../UI/Input/Input";
import { Loader } from "../../../../../UI/Loader/Loader";
import { normalizeNumberInput } from "../../../../../../utils/fields";

export const ExpDetail = () => {
  const {
    currentExp: { products, id: expID },
    isLoadingForm,
  } = useAppSelector((state) => state.expInc);
  const dispatch = useAppDispatch();

  const addProduct = () => {
    dispatch(
      createExpDetailApi({
        expID,
        expDetail: {
          name: "",
          price: 0,
          count: "",
          isEdit: true,
          expID: "",
        },
      })
    );
  };

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

  const changeProduct = (
    id: string,
    key: keyof ExpDetailItem,
    value: string | number | boolean
  ) => {
    dispatch(
      onChangeFieldsExp({
        key: "products",
        value: products.map((item) => {
          if (item.id === id) {
            return { ...item, [key]: value };
          } else {
            return item;
          }
        }),
      })
    );
  };

  const deleteProduct = (id: string) => {
    if (expID != "-1") {
      dispatch(deleteExpDetailApi({ id, expID: expID })).finally(() => {
        dispatch(
          onChangeFieldsExp({
            key: "products",
            value: products.filter((item) => {
              return item.id != id;
            }),
          })
        );
        toast.success(`Товар удачно удалён`);
      });
    } else {
      dispatch(
        onChangeFieldsExp({
          key: "products",
          value: products.filter((item) => {
            return item.id != id;
          }),
        })
      );
    }
  };

  const saveDetailExp = (id: string) => {
    const expDetail = products.find((product) => product.id === id);
    dispatch(
      updateExpDetailApi({
        expID,
        ...expDetail,
      })
    ).finally(() => {
      changeProduct(id, "isEdit", false);
    });
  };

  return (
    <fieldset className="relative flex flex-col items-start gap-5 rounded-md bg-primary-800 p-8">
      <legend className="px-1 text-sm text-text">Добавить товары</legend>
      <div className="flex max-h-[250px] w-full flex-col gap-5 overflow-auto p-1">
        {products.map((x) => {
          return (
            <div
              key={x.id}
              className="flex w-full items-end justify-between gap-4"
            >
              <div
                className="grid w-full items-center gap-5 [grid-template-columns:1fr_150px_100px]"
              >
                <InputField
                  label="Название товара"
                  placeholder="Наименование товара"
                  value={x.name}
                  onChange={(e) => {
                    changeProduct(x.id, "name", e.target.value);
                  }}
                  disabled={!x.isEdit}
                />
                <InputField
                  label="Кол. / вес товара"
                  placeholder="1 шт"
                  value={x.count}
                  onChange={(e) => {
                    changeProduct(x.id, "count", e.target.value);
                  }}
                  disabled={!x.isEdit}
                />
                <InputField
                  label="Цена товара"
                  type="text"
                  placeholder="Цена товара"
                  value={x.price}
                  onChange={(e) => {
                    changeProduct(
                      x.id,
                      "price",
                      normalizeNumberInput(e.target.value)
                    );
                  }}
                  disabled={!x.isEdit}
                />
              </div>
              {!x.isEdit ? (
                <button
                  type="button"
                  onClick={() => changeProduct(x.id, "isEdit", true)}
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-[#cccccc] text-[#242424] transition-colors hover:bg-[#bdbdbd]"
                >
                  <RiEdit2Line />
                </button>
              ) : (
                <div className="flex items-center gap-2 self-end p-1">
                  <Button
                    type="button"
                    onClick={() => {
                      deleteProduct(x.id);
                    }}
                    size="s"
                    theme="red"
                  >
                    <RiDeleteBin3Line />
                  </Button>
                  <Button
                    onClick={() => saveDetailExp(x.id)}
                    type="button"
                    size="s"
                    theme="light-green"
                  >
                    <LuSave />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Loader isLoading={isLoadingForm} />
      <Button
        className="absolute right-0 top-0 -translate-y-[calc(50%+10px)]"
        type="button"
        onClick={addProduct}
      >
        +
      </Button>
    </fieldset>
  );
};
