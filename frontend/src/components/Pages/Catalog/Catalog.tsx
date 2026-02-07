import { useEffect, useState, type FC } from "react";
import { CgPlayListAdd } from "react-icons/cg";
import { RiDeleteBin3Line, RiEdit2Line } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import {
  createCatalogApi,
  deleteCatalogApi,
  setCurrentCatalogID,
  toggleisOpenCatalogEditForm,
  TypeCatalog,
  type categoryItem,
  type categoryState,
} from "../../../stores/catalogSlice/catalogsSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Button } from "../../UI/Button/Button";
import { InputField } from "../../UI/Input/Input";
import { Loader } from "../../UI/Loader/Loader";
import { CatalogEditForm } from "./CatalogEditForm/CatalogEditForm";

interface CatalogItem {
  id: TypeCatalog;
  title: string;
  value: string;
  color: string;
  listName: keyof categoryState;
  onCreate: (x: { value: string; type: TypeCatalog }) => void;
}

interface ICatalogListItem {
  item: CatalogItem;
  onChange: (value: string) => void;
  catalogs: categoryState;
}

interface ICatalogDetailItem {
  catalog: categoryItem;
  x: CatalogItem;
}

const CatalogItem: FC<ICatalogDetailItem> = ({ catalog, x }) => {
  const dispatch = useAppDispatch();
  return (
    <li
      className="flex items-center gap-2.5 px-1.5 py-1"
      key={catalog.value}
      onClick={() => {
        console.log(x);
        console.log(catalog);
      }}
    >
      <div
        className="h-5 w-5 rounded-full"
        style={{ backgroundColor: catalog.color }}
      />
      <p className="mr-auto">{catalog.label}</p>
      <Button
        size="s"
        theme="grey"
        onClick={() => {
          dispatch(setCurrentCatalogID(catalog.value));
          dispatch(toggleisOpenCatalogEditForm(true));
        }}
      >
        <RiEdit2Line />
      </Button>
      <Button
        size="s"
        theme="grey"
        onClick={() => {
          dispatch(
            deleteCatalogApi({
              id: catalog.value,
              type: x.id,
            })
          );
        }}
      >
        <RiDeleteBin3Line />
      </Button>
    </li>
  );
};

const CatalogListItem: FC<ICatalogListItem> = ({
  item: x,
  onChange,
  catalogs,
}) => {
  const [isControl, addControl] = useState(false);
  return (
    <li
      className="rounded-2xl bg-primary-800 px-8 pb-8 pt-4"
      key={x.id}
    >
      <div>
        <div className="mb-4 flex w-full justify-between py-2.5">
          <h2 className="self-center text-[22px]">{x.title}</h2>
          <Button
            onClick={() => addControl(true)}
            size="s"
            theme="light-green"
          >
            <CgPlayListAdd />
          </Button>
        </div>

        {isControl && (
          <div className="mb-4 flex rounded-md bg-[color:var(--bg-nav-clr)] p-2">
            <InputField onChange={(e) => onChange(e.target.value)} />
            <Button
              onClick={() => {
                x.onCreate({ value: x.value, type: x.id });
                addControl(false);
              }}
              size="s"
              className="ml-auto mr-2.5"
            >
              save
            </Button>
            <Button size="s" theme="grey" onClick={() => addControl(false)}>
              <RiDeleteBin3Line />
            </Button>
          </div>
        )}
        <ul className="flex flex-col gap-2">
          {Array.isArray(catalogs[x.listName]) &&
            (catalogs[x.listName] as categoryItem[]).map((catalog) => {
              return (
                <CatalogItem catalog={catalog} x={x} key={catalog.value} />
              );
            })}
        </ul>
      </div>
    </li>
  );
};

export const Catalog = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((st) => st.catalogs.isLoading);
  const [items, setItem] = useState<CatalogItem[]>([
    {
      id: TypeCatalog.exp,
      title: "Каталог расходов",
      value: "",
      color: "",
      listName: "categoryExpList",
      onCreate: (x: { value: string; type: TypeCatalog; color: string }) => {
        dispatch(
          createCatalogApi({
            catalogName: x.value,
            catalogType: x.type,
            catalogColor: x.color,
          })
        );
      },
    },
    {
      id: TypeCatalog.inc,
      title: "Каталог доходов",
      value: "",
      color: "",
      listName: "typeInc",
      onCreate: (x: { value: string; type: TypeCatalog; color: string }) => {
        dispatch(
          createCatalogApi({
            catalogName: x.value,
            catalogType: x.type,
            catalogColor: x.color,
          })
        );
      },
    },
    {
      id: TypeCatalog.source,
      title: "Каталог источников дохода",
      value: "",
      color: "",
      listName: "sourceIncList",
      onCreate: (x: { value: string; type: TypeCatalog; color: string }) => {
        dispatch(
          createCatalogApi({
            catalogName: x.value,
            catalogType: x.type,
            catalogColor: x.color,
          })
        );
      },
    },
    {
      id: TypeCatalog.pay,
      title: "Каталог способов оплаты",
      value: "",
      color: "",
      listName: "methodInc",
      onCreate: (x: { value: string; type: TypeCatalog; color: string }) => {
        dispatch(
          createCatalogApi({
            catalogName: x.value,
            catalogType: x.type,
            catalogColor: x.color,
          })
        );
      },
    },
  ]);
  const catalogs = useAppSelector((st) => st.catalogs);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  return (
    <>
      <ContentHeader
        title="Каталог"
        subtitle="Вы можете гибко добавлять любой каталог для расходов и доходов"
      />
      <ContentMain>
        <ul className="grid grid-cols-2 gap-8">
          {items.map((x) => {
            return (
              <CatalogListItem
                key={x.id}
                catalogs={catalogs}
                item={x}
                onChange={(value) => {
                  setItem((prev) =>
                    prev.map((item) => {
                      if (item.id === x.id) {
                        return { ...x, value: value };
                      } else {
                        return item;
                      }
                    })
                  );
                }}
              />
            );
          })}
        </ul>
      </ContentMain>
      <Loader isLoading={isLoading} />
      <CatalogEditForm
        isOpen={catalogs.isOpenCatalogEditForm}
        onClose={() => dispatch(toggleisOpenCatalogEditForm(false))}
      />
    </>
  );
};
