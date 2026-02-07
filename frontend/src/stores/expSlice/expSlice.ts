import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { expBuilder } from "./expThunks";

export interface ExpDetailItem {
  id: string;
  name: string;
  price: number;
  count: string;
  expID: string;
  isEdit: boolean;
  createdAt?: string;
}

export type ExpItem = {
  price: number;
  descr: string;
  date: string;
  id: string;
  products: ExpDetailItem[];
  createdAt?: string;
  catalogId: string | null;
  categoryName: string;
};

export const getEmptyExp = (): ExpItem => {
  return {
    id: "-1",
    date: new Date().toISOString(),
    descr: "",
    price: 0,
    products: [],
    catalogId: null,
    categoryName: "",
  };
};

export type expState = {
  exp: ExpItem[];
  currentExp: ExpItem;
  isOpenExpForm: boolean;
  isOpenConfirm: boolean;
  selectedFilter: {
    key: keyof ExpItem;
    value: string;
  };
  isNewExp: boolean;
  onlyCreate: boolean;
  isLoadingTable: boolean;
  isLoadingForm: boolean;
};

const expState: expState = {
  exp: [],
  currentExp: getEmptyExp(),
  isOpenExpForm: false,
  isOpenConfirm: false,
  selectedFilter: {
    key: "catalogId",
    value: "",
  },
  isNewExp: false,
  onlyCreate: false,
  isLoadingForm: false,
  isLoadingTable: false,
};

const expSlice = createSlice({
  name: "exp",
  initialState: expState,
  reducers: {
    addExp: (state, action: PayloadAction<Omit<ExpItem, "id">>) => {
      state.exp = [
        ...state.exp,
        { ...action.payload, date: action.payload.date, id: Date.now() + "_" },
      ];
      state.currentExp = getEmptyExp();
    },
    putExp: (state, action: PayloadAction<ExpItem>) => {
      state.exp = state.exp.map((x) => {
        if (x.id === action.payload.id) {
          return action.payload;
        } else {
          return x;
        }
      });
    },
    deleteExp: (state, action: PayloadAction<string>) => {
      state.exp = state.exp.filter((x) => x.id != action.payload);
    },

    setCurrentExp: (state, action: PayloadAction<string | null>) => {
      const findExp = state.exp.find((x) => x.id === action.payload);
      state.currentExp = findExp ? findExp : getEmptyExp();
    },
    setOnlyCreate: (state, action: PayloadAction<boolean>) => {
      state.onlyCreate = action.payload;
    },
    setCurrentExpFull: (state, action: PayloadAction<ExpItem>) => {
      state.currentExp = action.payload;
    },
    onChangeFieldsExp: (
      state,
      action: PayloadAction<{
        key: string;
        value: string | number | ExpDetailItem[];
      }>
    ) => {
      state.currentExp = {
        ...state.currentExp,
        [action.payload.key]: action.payload.value,
      };
    },

    onChangeSelectedFilter: (
      state,
      action: PayloadAction<{ key: keyof ExpItem; value: string }>
    ) => {
      state.selectedFilter = action.payload;
    },
    toggleExpForm: (state, action: PayloadAction<boolean>) => {
      state.isOpenExpForm = action.payload;
    },
    toggleConfirm: (state, action: PayloadAction<boolean>) => {
      state.isOpenConfirm = action.payload;
    },
    getEmptyExpReducer: (
      state,
      action: PayloadAction<{ catalogId: string }>
    ) => {
      state.currentExp = {
        ...getEmptyExp(),
        catalogId: action.payload.catalogId,
      };
    },
    setIsNewExp: (state, action: PayloadAction<boolean>) => {
      state.isNewExp = action.payload;
    },
  },
  extraReducers: (builder) => {
    expBuilder(builder);
  },
});

// Извлекаем объект с создателями и редуктор
const { actions, reducer } = expSlice;
// Извлекаем и экспортируем каждого создателя по названию
export const {
  addExp,
  setCurrentExp,
  toggleExpForm,
  onChangeFieldsExp,
  putExp,
  deleteExp,
  onChangeSelectedFilter,
  toggleConfirm,
  getEmptyExpReducer,
  setIsNewExp,
  setCurrentExpFull,
  setOnlyCreate,
} = actions;
// Экпортируем редуктор по умолчанию или по названию
export default reducer;
