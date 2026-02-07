import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { noteBuilder } from "./noteThunks";

export type NoteItem = {
  id: string;
  createdAt: string;
  completed: boolean;
  isDeleted: boolean;
  content: string;
  title: string;
};
export type NoteState = {
  noteList: NoteItem[];
  historyNoteList: NoteItem[];
  isLoading: boolean;
  isLoadingUpdateItem: boolean;
  currentItem: NoteItem | null;
  isOpenNoteForm: boolean;
};

const initialNoteState: NoteState = {
  noteList: [],
  historyNoteList: [],
  isLoading: false,
  currentItem: null,
  isOpenNoteForm: false,
  isLoadingUpdateItem: false,
};

const NoteSlice = createSlice({
  name: "Notes",
  initialState: initialNoteState,
  reducers: {
    setOpenNoteForm: (state, action: PayloadAction<boolean>) => {
      state.isOpenNoteForm = action.payload;
    },
    setCurrentNote: (state, action: PayloadAction<NoteItem | null>) => {
      state.currentItem = action.payload;
    },
  },
  extraReducers: noteBuilder,
});

const { reducer, actions } = NoteSlice;
export const { setOpenNoteForm, setCurrentNote } = actions;

export default reducer;
