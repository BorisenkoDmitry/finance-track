import {
  createAsyncThunk,
  type ActionReducerMapBuilder,
  type WritableDraft,
} from "@reduxjs/toolkit";
import api from "../../Api/api";
import { extractApiError } from "../../types/api";
import type { RootState } from "../store";
import type { ExpDetailItem, ExpItem, expState } from "./expSlice";
import { getFinanceRemaining } from "../financeSlice/financeSlice";
import toast from "react-hot-toast";

type getExpDto = {
  descr?: string;
  price?: number;
  catalogId?: string;
  dateStart: string;
  dateEnd: string;
};

export const getExpApi = createAsyncThunk<ExpItem[], getExpDto>(
  "getExp",
  async (
    { catalogId, dateEnd, dateStart, descr, price },
    { rejectWithValue }
  ) => {
    return api
      .get(
        `exp?categoryId=${
          catalogId ? catalogId : ""
        }&dateEnd=${dateEnd}&dateStart=${dateStart}&descr=${
          descr ? descr : ""
        }&price=${price ? Number(price) : 0}`
      )
      .then((resp) => {
        return resp.data;
      })
      .then((d) => {
        return d;
      })
      .catch((err) => {

        return rejectWithValue(extractApiError(err));
      });
  }
);

export const updateExpApi = createAsyncThunk<void, ExpItem>(
  "updateExp",
  async (exp, { getState, rejectWithValue, dispatch }) => {
    const {
      expInc: { selectedFilter },
      global,
    } = getState() as RootState;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, products, ...other } = exp;
    try {
      const a = await api
        .patch(`exp/${id}`, {
          price: other.price,
          descr: other.descr,
          catalogId: other.catalogId,
          date: other.date,
        })
        .then((resp) => {
          return resp.data;
        });
      return a as void;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    } finally {
      dispatch(
        getExpApi({
          [selectedFilter.key]: selectedFilter.value,
          dateStart: global.periodDate.start,
          dateEnd: global.periodDate.end,
        })
      );
      dispatch(getFinanceRemaining());
    }
  }
);

export const updateExpDetailApi = createAsyncThunk<
  ExpDetailItem,
  ExpDetailItem
>("updateExpDetail", async (expDetail, { rejectWithValue }) => {
  const { id, expID, ...other } = expDetail;
  try {
    return await api
      .patch(`expDetail/${id}`, {
        expID: expID,
        exp: {
          price: other.price,
          name: other.name,
          count: other.count,
        },
      })
      .then((resp) => {
        return resp.data as ExpDetailItem;
      });
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const createExpDetailApi = createAsyncThunk<
  ExpDetailItem,
  { expDetail: Omit<ExpDetailItem, "id">; expID: string }
>("createExpDetail", async ({ expDetail, expID }, { rejectWithValue }) => {
  return api
    .post(`expDetail`, {
      expID,
      expDetail: {
        price: expDetail.price,
        name: expDetail.name,
        count: expDetail.count,
      },
    })
    .then(async (resp) => {
      return resp.data;
    })
    .then((d) => {
      return { ...(d as ExpDetailItem), isEdit: true };
    })
    .catch((err) => {
      return rejectWithValue(extractApiError(err));
    });
});

export const createExpApi = createAsyncThunk<ExpItem, Omit<ExpItem, "id">>(
  "createExp",
  async (exp, { dispatch, rejectWithValue }) => {
    const { catalogId, descr, date, price } = exp;
    try {
      const data = await api.post(`exp`, { catalogId, descr, price, date });
      return data.data as ExpItem;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    } finally {
      dispatch(getFinanceRemaining());
    }
  }
);

export const deleteExpApi = createAsyncThunk<void, ExpItem>(
  "deleteExp",
  async (exp, { getState, rejectWithValue, dispatch }) => {
    const {
      expInc: { selectedFilter },
      global,
    } = getState() as RootState;
    try {
      const a = await api.delete(`exp/${exp.id}`).then(async (resp) => {
        return resp.data;
      });
      return a as undefined;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    } finally {
      dispatch(
        getExpApi({
          [selectedFilter.key]: selectedFilter.value,
          dateStart: global.periodDate.start,
          dateEnd: global.periodDate.end,
        })
      );
      dispatch(getFinanceRemaining());
    }
  }
);

export const deleteExpDetailApi = createAsyncThunk<
  void,
  { id: string; expID: string }
>("deleteExpDetail", async (obj, { dispatch, rejectWithValue }) => {
  try {
    await api.request({
      method: "DELETE",
      url: `expDetail/${obj.id}`,
      data: { expID: obj.expID },
    });
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  } finally {
    dispatch(getFinanceRemaining());
  }
});

export const expBuilder = (
  builder: ActionReducerMapBuilder<WritableDraft<expState>>
) => {
  builder
    .addCase(getExpApi.pending, (state) => {
      state.isLoadingTable = true;
    })
    .addCase(getExpApi.rejected, (state) => {
      toast.error("Что то пошло не так");
      state.isLoadingTable = false;
    })
    .addCase(getExpApi.fulfilled, (state, action) => {
      state.exp = action.payload.map((x) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, ...object } = x;
        return {
          ...object,
          products: x.products.map((pr) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { createdAt, ...other } = pr;
            return other;
          }),
        };
      });
      state.isLoadingTable = false;
    });

  builder
    .addCase(createExpApi.pending, (state) => {
 
      state.isLoadingTable = true;
    })
    .addCase(createExpApi.rejected, (state) => {
      toast.error("Что то пошло не так");
      state.isLoadingTable = false;
    })
    .addCase(createExpApi.fulfilled, (state, action) => {
      toast.success("Расход успешно создан");
      state.currentExp = { ...action.payload, products: [] };
      state.isLoadingTable = false;
    });

  builder
    .addCase(updateExpApi.pending, (state) => {
      state.isLoadingTable = true;
    })
    .addCase(updateExpApi.rejected, (state) => {
      toast.error("Что то пошло не так");
      state.isLoadingTable = false;
    })
    .addCase(updateExpApi.fulfilled, (state) => {
      toast.success("Расход успешно изменён");
      state.isLoadingTable = false;
    });

  builder
    .addCase(createExpDetailApi.pending, (state) => {
      state.isLoadingForm = true;
    })
    .addCase(createExpDetailApi.rejected, (state) => {
      toast.error("Что то пошло не так");
      state.isLoadingForm = false;
    })
    .addCase(createExpDetailApi.fulfilled, (state, action) => {
      state.isLoadingForm = false;
      state.currentExp = {
        ...state.currentExp,
        products: [...state.currentExp.products, action.payload],
      };
    });

  builder
    .addCase(updateExpDetailApi.pending, (state) => {
      state.isLoadingForm = true;
    })
    .addCase(updateExpDetailApi.rejected, (state) => {
      toast.error("Что то пошло не так");
      state.isLoadingForm = false;
    })
    .addCase(updateExpDetailApi.fulfilled, (state, action) => {
      state.isLoadingForm = false;
      state.currentExp = {
        ...state.currentExp,
        products: state.currentExp.products.map((pr) => {
          if (pr.id === action.payload.id) {
            return { ...pr, ...action.payload };
          } else {
            return pr;
          }
        }),
      };
    });

  builder
    .addCase(deleteExpDetailApi.pending, (state) => {
      state.isLoadingForm = true;
    })
    .addCase(deleteExpDetailApi.rejected, (state) => {
      toast.error("Что то пошло не так");
      state.isLoadingForm = false;
    })
    .addCase(deleteExpDetailApi.fulfilled, (state) => {
      state.isLoadingForm = false;
    });

  builder
    .addCase(deleteExpApi.pending, (state) => {
      state.isLoadingTable = true;
    })
    .addCase(deleteExpApi.rejected, (state) => {
      toast.error("Что то пошло не так");
      state.isLoadingTable = false;
    })
    .addCase(deleteExpApi.fulfilled, (state) => {
      toast.success("Расход успешно удалён");
      state.isLoadingTable = false;
    });
};
