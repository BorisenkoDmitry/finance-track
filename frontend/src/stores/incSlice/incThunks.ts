import {
  createAsyncThunk,
  type ActionReducerMapBuilder,
  type WritableDraft,
} from "@reduxjs/toolkit";
import type { IncItem, incState } from "./incSlice";
import type { RootState } from "../store";
import toast from "react-hot-toast";
import api from "../../Api/api";
import { getFinanceRemaining } from "../financeSlice/financeSlice";

interface getIncApiDTO {
  dateStart: string;
  dateEnd: string;
  source?: string;
  description?: string;
  sum?: number;
}

export const getIncApi = createAsyncThunk<IncItem[], getIncApiDTO>(
  "getIncApi",
  async (
    { dateEnd, dateStart, description, source, sum },
    { rejectWithValue }
  ) => {
    const data = await api
      .get<IncItem[]>(
        `inc?dateStart=${dateStart}&dateEnd=${dateEnd}&source=${description}&description=${source}&sum=${
          sum ? Number(sum) : 0
        }`
      )
      .then((data) => data.data)
      .catch((err) => rejectWithValue(err));
    return data;
  }
);

export const createIncApi = createAsyncThunk<IncItem, IncItem>(
  "createIncApi",
  async (
    { date, description, source, method, typeInc, sum, catalogId  },
    { getState, rejectWithValue, dispatch }
  ) => {
    const {
      Inc: { selectedFilter },
      global: { periodDate },
    } = getState() as RootState;
    try {
      const data = await api
        .post(`inc`, {
          date,
          source,
          sum,
          description,
          typeInc,
          method,
          catalogId
        })
        .then((data) => data.data);
      return data as IncItem;
    } catch (err) {
      rejectWithValue(err);
    } finally {
      dispatch(
        getIncApi({
          dateEnd: periodDate.end,
          dateStart: periodDate.start,
          [selectedFilter.key]: selectedFilter.value,
        })
      );
      dispatch(getFinanceRemaining())
    }
  }
);

export const updateIncApi = createAsyncThunk<IncItem, IncItem>(
  "updateIncApi",
  async (
    { id, date, description, source, method, typeInc, sum, catalogId },
    { getState, rejectWithValue, dispatch }
  ) => {
    const {
      Inc: { selectedFilter },
      global: { periodDate },
    } = getState() as RootState;
    try {
      const data = await api
        .patch<IncItem>(`inc/${id}`, {
          date,
          source,
          sum,
          description,
          typeInc,
          method,
          catalogId
        })
        .then((data) => data.data);
      return data;
    } catch (err) {
      rejectWithValue(err);
    } finally {
      dispatch(
        getIncApi({
          dateEnd: periodDate.end,
          dateStart: periodDate.start,
          [selectedFilter.key]: selectedFilter.value,
        })
      );
      dispatch(getFinanceRemaining())
    }
  }
);

export const deleteIncApi = createAsyncThunk<void, string>(
  "deleteIncApi",
  async (id, { getState, rejectWithValue, dispatch }) => {
    const {
      Inc: { selectedFilter },
      global: { periodDate },
    } = getState() as RootState;
    try {
      const a = await api.delete(`inc/${id}`).then((data) => data.data);
      return a as undefined;
    } catch (err) {
      rejectWithValue(err);
    } finally {
      dispatch(
        getIncApi({
          dateEnd: periodDate.end,
          dateStart: periodDate.start,
          [selectedFilter.key]: selectedFilter.value,
        })
      );
      dispatch(getFinanceRemaining())
    }
  }
);

export const incBuilder = (
  builder: ActionReducerMapBuilder<WritableDraft<incState>>
) => {
  builder
    .addCase(getIncApi.fulfilled, (state, action) => {
      state.isLoadingTable = false;
      state.incList = action.payload;
    })
    .addCase(getIncApi.rejected, (state) => {
      state.isLoadingTable = false;
    })
    .addCase(getIncApi.pending, (state) => {
      state.isLoadingTable = true;
    });

  builder
    .addCase(createIncApi.fulfilled, (state, action) => {
      console.log(action.payload);
      state.isLoadingTable = false;
      toast.success("Доход успешно добавлен!");
    })
    .addCase(createIncApi.rejected, (state) => {
      state.isLoadingTable = false;
    })
    .addCase(createIncApi.pending, (state) => {
      state.isLoadingTable = true;
    });

  builder
    .addCase(updateIncApi.fulfilled, (state, action) => {
      console.log(action.payload);
      state.isLoadingTable = false;
      toast.success("Доход успешно изменён!");
    })
    .addCase(updateIncApi.rejected, (state) => {
      state.isLoadingTable = false;
    })
    .addCase(updateIncApi.pending, (state) => {
      state.isLoadingTable = true;
    });

  builder
    .addCase(deleteIncApi.fulfilled, (state, action) => {
      console.log(action.payload);
      state.isLoadingTable = false;
      toast.success("Доход успешно удалён!");
    })
    .addCase(deleteIncApi.rejected, (state) => {
      state.isLoadingTable = false;
    })
    .addCase(deleteIncApi.pending, (state) => {
      state.isLoadingTable = true;
    });
};
