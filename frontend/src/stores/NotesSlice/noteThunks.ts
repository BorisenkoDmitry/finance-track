import {
  createAsyncThunk,
  type ActionReducerMapBuilder,
  type WritableDraft,
} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../Api/api";
import { extractApiError, getErrorMessage, type ApiErrorPayload } from "../../types/api";
import type { NoteItem, NoteState } from "./noteSlice";

export enum isDeletedEnum {
  no,
  yes,
}

type getNotesDTO = {
  title?: string;
  dateStart: string;
  dateEnd: string;
  isDeleted?: isDeletedEnum;
};

export const getNotesApi = createAsyncThunk<NoteItem[], getNotesDTO>(
  "getNotes",
  async (b, { rejectWithValue }) => {
    return api
      .get(
        `notes?${b.title ? `title=${b.title}&` : ""}isDeleted=${
          b.isDeleted === undefined ? 2 : b.isDeleted
        }&dateStart=${b.dateStart}&dateEnd=${b.dateEnd}`
      )
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        return rejectWithValue(extractApiError(err));
      });
  }
);

type createNoteDTO = {
  title?: string;
  content?: string;
};

export const createNoteApi = createAsyncThunk<NoteItem, createNoteDTO>(
  "createNotes",
  async (b, { rejectWithValue }) => {
    return api
      .post(`notes`, {
        title: b.title,
        content: JSON.parse(b.content),
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        return rejectWithValue(extractApiError(err));
      });
  }
);

interface updateNoteDTO extends createNoteDTO {
  completed: boolean;
  id: string;
  isDeleted?: boolean;
}

export const updateNoteApi = createAsyncThunk<NoteItem, updateNoteDTO>(
  "updateNotes",
  async (b, { rejectWithValue }) => {
    return api
      .patch(`notes/${b.id}`, {
        title: b.title,
        content: b.content,
        completed: b.completed,
        isDeleted: b.isDeleted,
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        return rejectWithValue(extractApiError(err));
      });
  }
);

export const deleteNoteToHistoryApi = createAsyncThunk<void, string>(
  "deleteNotesToHistory",
  async (id, { rejectWithValue }) => {
    return api
      .delete(`notes/to-history/${id}`)
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        return rejectWithValue(extractApiError(err));
      });
  }
);

export const deleteNoteAlwaysApi = createAsyncThunk<void, string>(
  "deleteNotesAlways",
  async (id, { rejectWithValue }) => {
    return api
      .delete(`notes/${id}`)
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        return rejectWithValue(extractApiError(err));
      });
  }
);

export const noteBuilder = (
  builder: ActionReducerMapBuilder<WritableDraft<NoteState>>
) => {
  builder.addCase(getNotesApi.pending, (st) => {
    st.isLoading = true;
  });
  builder.addCase(getNotesApi.rejected, (st) => {
    toast.error("Что то пошло не так");
    st.isLoading = false;
  });
  builder.addCase(getNotesApi.fulfilled, (st, action) => {
    st.isLoading = false;
    st.noteList = action.payload.filter((x) => !x.isDeleted);
    st.historyNoteList = action.payload.filter((x) => x.isDeleted);
  });

  builder.addCase(createNoteApi.pending, (st) => {
    st.isLoading = true;
  });
  builder.addCase(createNoteApi.rejected, (st, action) => {
    toast.error(`Ошибка: ${getErrorMessage(action.payload as ApiErrorPayload)}`);
    st.isLoading = false;
  });
  builder.addCase(createNoteApi.fulfilled, (st) => {
    toast.success("Заметка успешно создана");
    st.isOpenNoteForm = false;
    st.isLoading = false;
  });

  builder.addCase(updateNoteApi.pending, (st) => {
    st.isLoadingUpdateItem = true;
  });
  builder.addCase(updateNoteApi.rejected, (st) => {
    toast.error("Что то пошло не так");
    st.isLoadingUpdateItem = false;
  });
  builder.addCase(updateNoteApi.fulfilled, (st) => {
    toast.success("Заметка успешно изменена");
    st.isLoadingUpdateItem = false;
    st.isOpenNoteForm = false;
  });

  builder.addCase(deleteNoteToHistoryApi.pending, (st) => {
    st.isLoading = true;
  });
  builder.addCase(deleteNoteToHistoryApi.rejected, (st) => {
    toast.error("Что то пошло не так");
    st.isLoading = false;
  });
  builder.addCase(deleteNoteToHistoryApi.fulfilled, (st) => {
    toast.success("Заметка перемещена в историю");
    st.isLoading = false;
  });

  builder.addCase(deleteNoteAlwaysApi.pending, (st) => {
    st.isLoading = true;
  });
  builder.addCase(deleteNoteAlwaysApi.rejected, (st) => {
    toast.error("Что то пошло не так");
    st.isLoading = false;
  });
  builder.addCase(deleteNoteAlwaysApi.fulfilled, (st) => {
    toast.success("Заметка удалена");
    st.isLoading = false;
  });
};
