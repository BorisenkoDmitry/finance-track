import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { incBuilder } from "./incThunks";

export type IncItem = {
  id: string;
  source: string; // источник
  sum: number;
  description: string;
  typeInc: string;
  method: string;
  date: string;
  catalogId: string;
};

export const getEmptyInc = (): IncItem => {
  return {
    id: "-1",
    source: "",
    date: new Date().toISOString(),
    description: "",
    sum: 0,
    method: "",
    typeInc: "",
    catalogId: null
  };
};

export type incState = {
  incList: IncItem[];
  currentInc: IncItem;
  isOpenIncForm: boolean;
  isOpenConfirm: boolean;
  isLoadingTable: boolean;
  selectedFilter: {
    key: keyof IncItem;
    value: string;
  };
};

const incState: incState = {
  incList: [],
  currentInc: getEmptyInc(),
  isOpenIncForm: false,
  isOpenConfirm: false,
  isLoadingTable: false,
  selectedFilter: {
    key: "source",
    value: "",
  },
};

const incSlice = createSlice({
  name: "inc",
  initialState: incState,
  reducers: {

    setCurrentInc: (state, action: PayloadAction<string | null>) => {
      const findInc = state.incList.find((x) => x.id === action.payload);
      state.currentInc = findInc ? findInc : getEmptyInc();
    },
    onChangeFieldsInc: (
      state,
      action: PayloadAction<{
        key: keyof IncItem;
        value: string | number;
      }>
    ) => {
      state.currentInc = {
        ...state.currentInc,
        [action.payload.key]: action.payload.value,
      };
    },

    onChangeSelectedFilter: (
      state,
      action: PayloadAction<{ key: keyof IncItem; value: string }>
    ) => {
      state.selectedFilter = action.payload;
    },
    toggleIncForm: (state, action: PayloadAction<boolean>) => {
      state.isOpenIncForm = action.payload;
    },
    toggleConfirm: (state, action: PayloadAction<boolean>) => {
      state.isOpenConfirm = action.payload;
    },

    getEmptyIncReducer: (
      state,
      action: PayloadAction<{ typeInc: string; method: string; source: string }>
    ) => {
      state.currentInc = { ...getEmptyInc(), ...action.payload };
    },
  },
  extraReducers: (builder) => incBuilder(builder),
});

// Извлекаем объект с создателями и редуктор
const { actions, reducer } = incSlice;
// Извлекаем и экспортируем каждого создателя по названию
export const {
  setCurrentInc,
  toggleIncForm,
  onChangeFieldsInc,
  onChangeSelectedFilter,
  getEmptyIncReducer,
  toggleConfirm,
} = actions;
// Экпортируем редуктор по умолчанию или по названию
export default reducer;
