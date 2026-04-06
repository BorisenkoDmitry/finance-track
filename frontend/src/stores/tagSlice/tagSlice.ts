import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../Api/api";
import toast from "react-hot-toast";
import { extractApiError } from "../../types/api";

export type TagEntity = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  userId: string;
};

type TagState = {
  tags: TagEntity[];
  isLoading: boolean;
  isOpenTagEditForm: boolean;
  currentTagID: string | null;
};

const initialState: TagState = {
  tags: [],
  isLoading: false,
  isOpenTagEditForm: false,
  currentTagID: null,
};

export const getTagsApi = createAsyncThunk<TagEntity[], void>(
  "tags/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await api.get("tags");
      return resp.data as TagEntity[];
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

export const createTagApi = createAsyncThunk<
  TagEntity,
  { name: string; color?: string }
>("tags/create", async (dto, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.post("tags", dto);
    return resp.data as TagEntity;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  } finally {
    dispatch(getTagsApi());
  }
});

export const updateTagApi = createAsyncThunk<
  TagEntity,
  { id: string; name: string; color?: string }
>("tags/update", async ({ id, ...dto }, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.patch(`tags/${id}`, dto);
    return resp.data as TagEntity;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  } finally {
    dispatch(getTagsApi());
  }
});

export const deleteTagApi = createAsyncThunk<void, string>(
  "tags/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`tags/${id}`);
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    } finally {
      dispatch(getTagsApi());
    }
  }
);

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    toggleTagEditForm: (state, action: PayloadAction<boolean>) => {
      state.isOpenTagEditForm = action.payload;
    },
    setCurrentTagID: (state, action: PayloadAction<string | null>) => {
      state.currentTagID = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTagsApi.pending, (state) => { state.isLoading = true; })
      .addCase(getTagsApi.rejected, (state) => { state.isLoading = false; })
      .addCase(getTagsApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
      });
    builder
      .addCase(createTagApi.pending, (state) => { state.isLoading = true; })
      .addCase(createTagApi.rejected, (state) => { state.isLoading = false; })
      .addCase(createTagApi.fulfilled, (state) => { state.isLoading = false; });
    builder
      .addCase(updateTagApi.pending, (state) => { state.isLoading = true; })
      .addCase(updateTagApi.rejected, (state) => {
        state.isLoading = false;
        toast.error("Что-то пошло не так");
      })
      .addCase(updateTagApi.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Тег обновлён!");
      });
    builder
      .addCase(deleteTagApi.pending, (state) => { state.isLoading = true; })
      .addCase(deleteTagApi.rejected, (state) => { state.isLoading = false; })
      .addCase(deleteTagApi.fulfilled, (state) => { state.isLoading = false; });
  },
});

export const { toggleTagEditForm, setCurrentTagID } = tagSlice.actions;
export default tagSlice.reducer;
