import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../Api/api";
import toast from "react-hot-toast";

type TypeItem = {
  name: string;
  id: string;
  color?: string;
};

export enum TypeCatalog {
  inc = 1,
  exp,
  source,
  pay,
}

export type CatalogEntity = {
  id: string;
  catalogName: string;
  catalogColor: string;
  catalogType: TypeCatalog;
  createdAt: string;
  userId: string;
};

export const getCatalogApi = createAsyncThunk<
  {
    fCatalog: {
      type: TypeCatalog;
      arr: TypeItem[];
      arrFull: CatalogEntity[];
    }[];
    Catalogs: CatalogEntity[];
  },
  void
>("getCatalog", async (_, { rejectWithValue }) => {
  return Promise.all(
    [TypeCatalog.exp, TypeCatalog.inc, TypeCatalog.pay, TypeCatalog.source].map(
      (type) => {
        return api
          .get(`catalogs?type=${type}`)
          .then((resp) => {
            return resp.data;
          })
          .then((d) => {
            const answer = d as CatalogEntity[];
            return {
              type,
              arr: answer.map((x) => {
                return { id: x.id, name: x.catalogName, color: x.catalogColor };
              }),
              arrFull: answer,
            };
          });
      }
    )
  )
    .then((d) => {
      let catalogs: CatalogEntity[] = [];
      d.forEach((x) => {
        catalogs = [...catalogs, ...x.arrFull];
      });
      return {
        fCatalog: d,
        Catalogs: catalogs,
      };
    })
    .catch((err) => {
      return rejectWithValue(err);
    });
});

type CreateCatalogDto = {
  catalogName: string;
  catalogType: TypeCatalog;
  catalogColor: string;
  catalogId?: string;
};

export const createCatalogApi = createAsyncThunk<
  CatalogEntity,
  CreateCatalogDto
>(
  "createCatalog",
  async ({ catalogName, catalogType }, { rejectWithValue, dispatch }) => {
    try {
      const data = await api
        .post(`catalogs`, { catalogName, catalogType })
        .then((resp) => {
          return resp.data as CatalogEntity;
        });
      return data;
    } catch (err) {
      rejectWithValue(err);
    } finally {
      dispatch(getCatalogApi());
    }
  }
);

export const updateCatalogApi = createAsyncThunk<
  CatalogEntity,
  CreateCatalogDto
>(
  "updateCatalog",
  async (
    { catalogName, catalogType, catalogId, catalogColor },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const data = await api
        .patch(`catalogs/${catalogId}`, {
          catalogName,
          catalogType,
          catalogColor,
        })
        .then((resp) => {
          return resp.data as CatalogEntity;
        });
      return data;
    } catch (err) {
      rejectWithValue(err);
    } finally {
      dispatch(getCatalogApi());
    }
  }
);

export const deleteCatalogApi = createAsyncThunk<
  void,
  { id: string; type: TypeCatalog }
>("deleteCatalog", async (obj, { rejectWithValue, dispatch }) => {
  try {
    const a = await api
      .delete(`catalogs/${obj.id}`)
      .then((resp) => {
        return resp.data;
      })
      .then((d) => {
        return d as undefined;
      });
    return a;
  } catch (err) {
    rejectWithValue(err);
  } finally {
    dispatch(getCatalogApi());
  }
});

export type categoryItem = {
  label: string;
  value: string;
  color?: string;
};

export type categoryState = {
  categoryExpList: categoryItem[]; // тип расходов
  sourceIncList: categoryItem[]; // источники
  methodInc: categoryItem[]; // способ оплаты
  typeInc: categoryItem[]; // тип доходов
  catalogsFull: CatalogEntity[];
  isLoading: boolean;
  isOpenCatalogEditForm: boolean;
  currentCatalogID: string | null;
};

const catalogsState: categoryState = {
  categoryExpList: [
    { label: "Еда", value: "Еда" },
    { label: "Спорт", value: "Спорт" },
    { label: "Одежда", value: "Одежда" },
    { label: "Электрика", value: "Электрика" },
    { label: "Мебель", value: "Мебель" },
  ],
  sourceIncList: [
    { label: "ООО Дата код", value: "ООО Дата код" },
    { label: "ООО Skillbox", value: "ООО Skillbox" },
  ],

  methodInc: [
    {
      label: "Банковская карта",
      value: "Банковская карта",
    },
    {
      label: "Наличные",
      value: "Наличные",
    },
    {
      label: "Биткоины",
      value: "Биткоины",
    },
  ],
  typeInc: [
    { label: "Фриланс", value: "Фриланс" },
    { label: "Зарплата", value: "Зарплата" },
    { label: "Ивенстиции", value: "Ивестиции" },
    { label: "Аренда", value: "Аренда" },
  ],
  catalogsFull: [],
  isLoading: false,
  isOpenCatalogEditForm: false,
  currentCatalogID: null
};

const catalogsSlice = createSlice({
  name: "catalogs",
  initialState: catalogsState,
  reducers: {
    toggleisOpenCatalogEditForm: (state, action: PayloadAction<boolean>) => {
        state.isOpenCatalogEditForm = action.payload;
    },
    setCurrentCatalogID: (state, action: PayloadAction<string | null>) => {
      state.currentCatalogID = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCatalogApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCatalogApi.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getCatalogApi.fulfilled, (state, action) => {
        state.isLoading = false;
        const keys = [
          "typeInc",
          "categoryExpList",
          "sourceIncList",
          "methodInc",
        ];
        action.payload.fCatalog.forEach((x) => {
          state[keys[x.type - 1]] = x.arr.map((x) => {
            return { label: x.name, value: x.id, color: x.color };
          });
        });
        state.catalogsFull = action.payload.Catalogs;
      });
    builder
      .addCase(deleteCatalogApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCatalogApi.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCatalogApi.fulfilled, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(createCatalogApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCatalogApi.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createCatalogApi.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCatalogApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCatalogApi.rejected, (state) => {
        state.isLoading = false;
        toast.error("Что то пошло не так");
      })
      .addCase(updateCatalogApi.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Каталог удачно изменён!");
      });
  },
});

// Извлекаем объект с создателями и редуктор
const { reducer } = catalogsSlice;
// Извлекаем и экспортируем каждого создателя по названию
export const { toggleisOpenCatalogEditForm, setCurrentCatalogID } = catalogsSlice.actions;
// Экпортируем редуктор по умолчанию или по названию
export default reducer;
