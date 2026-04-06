import {
  createAsyncThunk,
  type ActionReducerMapBuilder,
  type WritableDraft,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type {
  FiltersCatalog,
  myBudgetItem,
  myBudgetState,
} from "./myBudgetSlice";

import api from "../../Api/api";
import { extractApiError } from "../../types/api";
import type { TypeCatalog } from "../catalogSlice/catalogsSlice";
import toast from "react-hot-toast";

interface IBudgetDTO {
  type: TypeCatalog | FiltersCatalog;
  dateStart: string;
  dateEnd: string;
}

export const getBudgetsApi = createAsyncThunk<myBudgetItem[], IBudgetDTO>(
  "getBudgets",
  async ({ type, dateEnd, dateStart }, { rejectWithValue }) => {
    return api
      .get(
        `budgets?${
          type === 5 ? `` : `type=${type}`
        }&dateEnd=${dateEnd}&dateStart=${dateStart}`
      )
      .then((resp) => {
        return resp.data;
      })
      .then((d) => {
        return d;
      })
      .catch((err) => rejectWithValue(extractApiError(err)));
  }
);

export const createBudgetsApi = createAsyncThunk<myBudgetItem, myBudgetItem>(
  "createBudgets",
  async (budget, { getState, rejectWithValue, dispatch }) => {
    const st = getState() as RootState;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, dateCreated, userId, ...props } = budget;
    try {
      const a = await api
        .post(`budgets`, {
          ...props,
          dateCreated: dateCreated ? dateCreated : new Date().toISOString(),
        })
        .then((resp) => {
          return resp.data as myBudgetItem;
        });
      return a;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    } finally {
      dispatch(
        getBudgetsApi({
          type: st.budget.filters.type,
          dateEnd: new Date(st.global.periodDate.end).toISOString(),
          dateStart: new Date(st.global.periodDate.start).toISOString(),
        })
      );
    }
  }
);

export const editBudgetsApi = createAsyncThunk<myBudgetItem, myBudgetItem>(
  "editBudgets",
  async (budget, { getState, rejectWithValue, dispatch }) => {
    const st = getState() as RootState;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, userId, ...other } = budget;
    try {
      const data = await api.patch(`budgets/${id}`, other).then((resp) => {
        return resp.data as myBudgetItem;
      });
      return data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    } finally {
      dispatch(
        getBudgetsApi({
          type: st.budget.filters.type,
          dateEnd: new Date(st.global.periodDate.end).toISOString(),
          dateStart: new Date(st.global.periodDate.start).toISOString(),
        })
      );
    }
  }
);

export const deleteBudgetsApi = createAsyncThunk<void, { id: string }>(
  "deleteBudgets",
  async ({ id }, { getState, rejectWithValue, dispatch }) => {
    const st = getState() as RootState;
    try {
      const data = await api.delete(`budgets/${id}`).then((resp) => {
        return resp.data as undefined;
      });
      return data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    } finally {
      dispatch(
        getBudgetsApi({
          type: st.budget.filters.type,
          dateEnd: new Date(st.global.periodDate.end).toISOString(),
          dateStart: new Date(st.global.periodDate.start).toISOString(),
        })
      );
    }
  }
);

export const budgetBuilder = (
  builder: ActionReducerMapBuilder<WritableDraft<myBudgetState>>
) => {
  builder.addCase(getBudgetsApi.fulfilled, (state, action) => {
    state.list = action.payload;
    state.isLoading = false;
  });
  builder.addCase(getBudgetsApi.rejected, (state) => {
    toast.error("Что то пошло не так");
    state.isLoading = false;
  });
  builder.addCase(getBudgetsApi.pending, (state) => {
    state.isLoading = true;
  });

  builder.addCase(createBudgetsApi.fulfilled, () => {
    toast.success("Бюджет удачно создан");
  });

  builder.addCase(createBudgetsApi.rejected, (state) => {
    toast.error("Что то пошло не так");
    state.isLoading = false;
  });

  builder.addCase(createBudgetsApi.pending, (state) => {
    state.isLoading = true;
  });

  builder.addCase(editBudgetsApi.fulfilled, (state) => {
    toast.success("Бюджет удачно изменён");
    state.isLoading = false;
  });

  builder.addCase(editBudgetsApi.rejected, (state) => {
    toast.error("Что то пошло не так");
    state.isLoading = false;
  });

  builder.addCase(editBudgetsApi.pending, (state) => {
    state.isLoading = true;
  });

  builder.addCase(deleteBudgetsApi.fulfilled, (state) => {
    state.isLoading = false;
    toast.success("Бюджет удачно удалён");
  });

  builder.addCase(deleteBudgetsApi.rejected, (state) => {
    state.isLoading = false;
    toast.error("Что то пошло не так");
  });

  builder.addCase(deleteBudgetsApi.pending, (state) => {
    state.isLoading = true;
  });
};
