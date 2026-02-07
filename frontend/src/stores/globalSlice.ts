import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TypeDates } from "../components/UI/DateField/DateRangeField";
import { parseDate } from "../utils/parseDate";

const getDate = (type: "start" | "end") => {
  const now = new Date();
  if (type === "start") {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  } else {
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
  }
};

export type typePeriodDate = {
  start: string;
  end: string;
};

type globalState = {
  periodDate: {
    start: string,
    end: string
  };
  typeDate: TypeDates
};

const globalState: globalState = {
  periodDate: {
    start: getDate("start"),
    end: getDate("end"),
  },
  typeDate: "months"
}

const globalSlice = createSlice({
  name: "global",
  initialState: globalState,
  reducers: {
    setPeriodDate: (state, action: PayloadAction<typePeriodDate>) => {
      const normDate = parseDate.normalizeDate(action.payload.start, action.payload.end, state.typeDate)
      state.periodDate = {
        start: normDate.start.toISOString(),
        end: normDate.end.toISOString()
      };
    },
    setTypeDate: (state, action: PayloadAction<TypeDates>) => {
        state.typeDate = action.payload;
    }
  },
  selectors: {
    perDate: (d) => {
      return {
        start: new Date(d.periodDate.start),
        end: new Date(d.periodDate.end)
      }
    }
  }
});

// Извлекаем объект с создателями и редуктор
const { reducer } = globalSlice;
// Извлекаем и экспортируем каждого создателя по названию
export const { setPeriodDate, setTypeDate } = globalSlice.actions;
export const { perDate } = globalSlice.selectors;
// Экпортируем редуктор по умолчанию или по названию
export default reducer;

