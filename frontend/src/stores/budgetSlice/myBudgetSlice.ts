import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { TypeCatalog } from "../catalogSlice/catalogsSlice";
import { budgetBuilder } from "./myBudgetThunks";

const getEmptyBudget = (): myBudgetItem => {
  return {
    id: "-1",
    categoryName: "",
    color: "#aabbcc",
    comment: "",
    dateCreated: new Date().toISOString(),
    period: "month",
    planned_amount: 0,
    type: TypeCatalog.exp,
    userId: "",
    catalogId: null,
  };
};

export type myBudgetItem = {
  id: string;
  categoryName: string;
  type: TypeCatalog | FiltersCatalog;
  planned_amount: number;
  period: "month";
  color: string;
  dateCreated: string;
  comment: string;
  createdAt?: string;
  userId: string;
  catalogId: string | null;
};

export type myBudgetState = {
  list: myBudgetItem[];
  chooseList: myBudgetItem[];
  isOpenForm: boolean;
  isOpenConfirm: boolean;
  isLoading: boolean;
  currentBudget: myBudgetItem;
  filters: {
    type: TypeCatalog | FiltersCatalog;
  };
};

export enum FiltersCatalog {
  all = 5,
}

const myBudgetState: myBudgetState = {
  list: [],
  chooseList: [],
  isOpenForm: false,
  isOpenConfirm: false,
  isLoading: false,
  currentBudget: getEmptyBudget(),
  filters: {
    type: TypeCatalog.exp,
  },
};

const myBudgetSlice = createSlice({
  name: "myBudget",
  initialState: myBudgetState,
  reducers: {
    editBudget: (
      state,
      action: PayloadAction<{
        key: keyof myBudgetItem;
        value: string | number | TypeCatalog | "month";
      }>
    ) => {
      state.currentBudget = {
        ...state.currentBudget,
        [action.payload.key]: action.payload.value,
      };
    },
    setChoosed: (state, action: PayloadAction<myBudgetItem | null>) => {
      if (action.payload === null) {
        state.chooseList = [];
      } else {
        if (state.chooseList.find((x) => x.id === action.payload.id)) {
          state.chooseList = state.chooseList.filter(
            (x) => x.id != action.payload.id
          );
        } else {
          state.chooseList = [...state.chooseList, action.payload];
        }
      }
    },
    setToggleForm: (state, action: PayloadAction<boolean>) => {
      state.isOpenForm = action.payload;
    },
    setToggleConfirm: (state, action: PayloadAction<boolean>) => {
      state.isOpenConfirm = action.payload;
    },
    setCurrentBudget: (state, action: PayloadAction<{ id: string } | null>) => {
      if (action.payload === null) {
        state.currentBudget = getEmptyBudget();
      } else {
        const findedItem = state.list.find((x) => x.id === action.payload.id);
        if (findedItem) {
          state.currentBudget = findedItem;
        }
      }
    },
    setFilterType: (
      state,
      action: PayloadAction<TypeCatalog | FiltersCatalog>
    ) => {
      state.filters.type = action.payload;
    },
    setCurrentType: (state, action: PayloadAction<string>) => {
      state.currentBudget.categoryName = action.payload;
    },
  },
  extraReducers: (builder) => {
    budgetBuilder(builder);
  },
});

// Извлекаем объект с создателями и редуктор
const { reducer } = myBudgetSlice;
// Извлекаем и экспортируем каждого создателя по названию
export const {
  setToggleForm,
  setToggleConfirm,
  editBudget,
  setCurrentBudget,
  setChoosed,
  setFilterType,
  setCurrentType,
} = myBudgetSlice.actions;
// Экпортируем редуктор по умолчанию или по названию
export default reducer;
