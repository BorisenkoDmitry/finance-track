import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Api/api";
import { fillMonthDays } from "../../utils/compareForPraphics";

export type financeAnaliticItem = {
  total: string;
  day: Date;
};

export type FinanceAnaliticResponse = {
  catalogName: string;
  catalogType: number;
  catalogColor: string | null;
  exps: {
    financeAnalitic: financeAnaliticItem[];
    totalPeriodExp: string;
  };
  budgets: {
    financeAnalitic: financeAnaliticItem[];
    totalPeriodBudgets: string;
  };
};

type FinanceState = {
  financeAnaliticResp: FinanceAnaliticResponse[];
  remainingFinance: number;
  isLoadingFinanceRem: boolean;
  financeExpIncResp: FinanceAnaliticIncExpResponse | null;
  isLoadingfinanceExpIncResp: boolean;
};

const financeState: FinanceState = {
  financeAnaliticResp: [],
  remainingFinance: 0,
  isLoadingFinanceRem: false,
  financeExpIncResp: null,
  isLoadingfinanceExpIncResp: false,
};

export const getFinanceRemaining = createAsyncThunk(
  "getFinanceRem",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("finance");
      return res.data as { total: number };
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

type GetFinanceAnaliticExpDto = {
  catalogIds?: string[];
  dateEnd: string;
  dateStart: string;
};

export const getFinanceAnaliticExp = createAsyncThunk<
  FinanceAnaliticResponse[],
  GetFinanceAnaliticExpDto
>(
  "getFinanceAnaliticExp",
  async ({ catalogIds, dateEnd, dateStart }, { rejectWithValue }) => {
    try {
      const res = await Promise.all(
        catalogIds.map((x) =>
          api
            .get(
              `finance/range-exps?dateStart=${dateStart}&dateEnd=${dateEnd}&catalogId=${x}`
            )
            .then((res) => res.data as FinanceAnaliticResponse)
        )
      );

      const modify = res.map((x) => {
        return {
          ...x,
          exps: {
            financeAnalitic: fillMonthDays(
              x.exps.financeAnalitic,
              new Date(dateStart)
            ),
            totalPeriodExp: x.exps.totalPeriodExp,
          },
          budgets: {
            financeAnalitic: fillMonthDays(
              x.budgets.financeAnalitic,
              new Date(dateStart),
              x.budgets.totalPeriodBudgets
            ),
            totalPeriodBudgets: x.budgets.totalPeriodBudgets,
          },
        };
      });

      return modify;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export type FinanceAnaliticIncExpMonth = {
  month: string;
  total: string;
};

export type FinanceAnaliticIncExpResponse = {
  incsMonthly: FinanceAnaliticIncExpMonth[];
  budgetsMonthly: FinanceAnaliticIncExpMonth[];
  expsMonthly: FinanceAnaliticIncExpMonth[];
  incsTotal: number;
  budgetsTotal: number;
  expsTotal: number;
};

export const getFinanceAnaliticIncExp = createAsyncThunk<
  FinanceAnaliticIncExpResponse,
  GetFinanceAnaliticExpDto
>("getFinanceAnaliticInc", async (b, { rejectWithValue }) => {
  return api
    .get(`finance/range-inc?dateStart=${b.dateStart}&dateEnd=${b.dateEnd}`)
    .then((d) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = (d.data as any).aggregates as FinanceAnaliticIncExpResponse;
      return res;
    })
    .catch((err) => rejectWithValue(err));
});

const st = createSlice({
  name: "finance",
  initialState: financeState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFinanceRemaining.pending, (state) => {
      state.isLoadingFinanceRem = true;
    });
    builder.addCase(getFinanceRemaining.rejected, (state) => {
      state.isLoadingFinanceRem = false;
    });
    builder.addCase(getFinanceRemaining.fulfilled, (state, action) => {
      state.isLoadingFinanceRem = false;
      state.remainingFinance = action.payload.total;
    });

    builder.addCase(getFinanceAnaliticExp.pending, (state) => {
      state.isLoadingFinanceRem = true;
    });
    builder.addCase(getFinanceAnaliticExp.rejected, (state) => {
      state.isLoadingFinanceRem = false;
    });
    builder.addCase(getFinanceAnaliticExp.fulfilled, (state, action) => {
      state.isLoadingFinanceRem = false;
      state.financeAnaliticResp = action.payload;
    });

    builder.addCase(getFinanceAnaliticIncExp.pending, (state) => {
      state.isLoadingfinanceExpIncResp = true;
    });
    builder.addCase(getFinanceAnaliticIncExp.rejected, (state) => {
      state.isLoadingfinanceExpIncResp = false;
    });
    builder.addCase(getFinanceAnaliticIncExp.fulfilled, (state, action) => {
      state.isLoadingfinanceExpIncResp = false;
      state.financeExpIncResp = action.payload;
    });
  },
});

const { reducer } = st;

export default reducer;
