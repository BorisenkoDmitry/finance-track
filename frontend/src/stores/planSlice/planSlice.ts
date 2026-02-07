import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../Api/api";

export type PlanDetailItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  planDetailDate: string;
  planDetailDatePay: string;
  planDetailPrice: number;
  isComplete: boolean;
  planId: string;
};

export type PlanItem = {
  id: string;
  createdAt: string;
  planDate: string;
  planName: string;
  planPrice: number;
  planColor: string;
  detailPlans: PlanDetailItem[];
};
export type PlanState = {
  plansList: PlanItem[];
  currentItemDetail: PlanDetailItem | null;
  currentItem: PlanItem | null;
  isLoading: boolean;
  isOpenAddForm: boolean;
  isPlannedCheckedForm: boolean;
  isOpenShutDownPlan: boolean;
};

const initialPlanState: PlanState = {
  plansList: [],
  currentItem: null,
  currentItemDetail: null,
  isLoading: false,
  isOpenAddForm: false,
  isPlannedCheckedForm: false,
  isOpenShutDownPlan: false,
};

export const getPlansApi = createAsyncThunk<PlanItem[]>(
  "getPlansApi",
  async (_, { rejectWithValue }) => {
    return api
      .get("/plan")
      .then((d) => d.data as PlanItem[])
      .catch((err) => rejectWithValue(err));
  }
);

export type createPlansApiDTO = {
  planDate: Date;
  planName: string;
  planPrice: string;
  planColor: string;
};

export const createPlansApi = createAsyncThunk<PlanItem, createPlansApiDTO>(
  "createPlansApi",
  async ({ planDate, planName, planPrice, planColor }, { rejectWithValue }) => {
    return api
      .post("/plan", {
        planDate,
        planName,
        planPrice: Number(planPrice),
        planColor,
      })
      .then((d) => d.data as PlanItem)
      .catch((err) => rejectWithValue(err));
  }
);

export const deletePlanApi = createAsyncThunk<{ isDeleted: boolean }, string>(
  "deletePlanApi",
  async (id, { rejectWithValue }) => {
    return api
      .delete(`/plan/${id}`)
      .then((d) => d.data as { isDeleted: boolean })
      .catch((err) => rejectWithValue(err));
  }
);

export const onCheckPlanDatailApi = createAsyncThunk<
  {
    current: PlanDetailItem;
    planId: string;
  },
  {
    current: PlanDetailItem;
    planId: string;
  }
>("onCheckPlanDatailApi", async ({ current, planId }, { rejectWithValue }) => {
  return api
    .put(`/plan/checked/${current.id}`, {
      price: Number(current.planDetailPrice),
    })
    .then((d) => {
      return {
        current: d.data as PlanDetailItem,
        planId,
      };
    })
    .catch((err) => rejectWithValue(err));
});

const PlanSlice = createSlice({
  name: "Plans",
  initialState: initialPlanState,
  reducers: {
    toggleOpenAddForm: (state, action: PayloadAction<boolean>) => {
      state.isOpenAddForm = action.payload;
    },
    togglePlannedCheckedForm: (state, action: PayloadAction<boolean>) => {
      state.isPlannedCheckedForm = action.payload;
    },
    togglePlannedShutDown: (state, action: PayloadAction<boolean>) => {
      state.isOpenShutDownPlan = action.payload;
    },
    setCurrentItemDetail: (
      state,
      action: PayloadAction<PlanDetailItem | null>
    ) => {
      state.currentItemDetail = action.payload;
    },
    setCurrentPlan: (state, action: PayloadAction<PlanItem | null>) => {
      state.currentItem = action.payload;
    },
  },
  extraReducers: (build) => {
    build.addCase(getPlansApi.pending, (state) => {
      state.isLoading = true;
    });
    build.addCase(getPlansApi.rejected, (state) => {
      toast.error("Ошибка при получении списка планов");
      state.isLoading = false;
    });
    build.addCase(getPlansApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.plansList = action.payload;
    });

    build.addCase(createPlansApi.pending, (state) => {
      state.isLoading = true;
    });
    build.addCase(createPlansApi.rejected, (state, action) => {
      toast.error(
        `Ошибка при создании плана: ${
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (action.payload as any).response.data.message
        }`
      );
      state.isLoading = false;
    });
    build.addCase(createPlansApi.fulfilled, (state) => {
      toast.success("Ваш план успешно добавлен");
      state.isLoading = false;
    });

    build.addCase(deletePlanApi.pending, (state) => {
      state.isLoading = true;
    });
    build.addCase(deletePlanApi.rejected, (state) => {
      toast.error("Ошибка при удалении плана");
      state.isLoading = false;
    });
    build.addCase(deletePlanApi.fulfilled, (state) => {
      toast.success("Ваш план успешно удалён");
      state.isLoading = false;
    });

    build.addCase(onCheckPlanDatailApi.pending, () => {});
    build.addCase(onCheckPlanDatailApi.rejected, () => {
      toast.error("Что то пошло не так");
    });
    build.addCase(onCheckPlanDatailApi.fulfilled, () => {});
  },
});

const { reducer, actions } = PlanSlice;
export const {
  toggleOpenAddForm,
  togglePlannedCheckedForm,
  setCurrentItemDetail,
  togglePlannedShutDown,
  setCurrentPlan,
} = actions;

export default reducer;
