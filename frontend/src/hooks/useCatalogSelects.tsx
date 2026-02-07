import { useEffect, useState } from "react";
import {
  TypeCatalog,
  type categoryItem,
} from "../stores/catalogSlice/catalogsSlice";
import { useAppSelector } from "./storeHook";
import type { FiltersCatalog } from "../stores/budgetSlice/myBudgetSlice";

export const useCatalogSelects = (type: TypeCatalog | FiltersCatalog) => {
  const catalogs = useAppSelector((st) => st.catalogs);
  const [selectedCatalog, setCatalog] = useState<categoryItem>(null);
  const [listCatalog, setListCatalog] = useState<categoryItem[]>([]);

  useEffect(() => {
    switch (type) {
      case TypeCatalog.exp:
        setListCatalog(catalogs.categoryExpList);
        break;
      case TypeCatalog.inc:
        setListCatalog(catalogs.typeInc);
        break;
      case TypeCatalog.source:
        setListCatalog(catalogs.sourceIncList);
        break;
      case TypeCatalog.pay:
        setListCatalog(catalogs.methodInc);
        break;
    }
  }, [catalogs, type]);



  return {
    selectedCatalog,
    setCurrentCatalog: (c: categoryItem) => setCatalog(c),
    listCatalog,
  };
};
