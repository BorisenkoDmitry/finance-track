import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./userSlice";
import expSlice from "./expSlice/expSlice";
import incSlice from "./incSlice/incSlice";
import catalogsSlice from "./catalogSlice/catalogsSlice";
import budgetSlice from "./budgetSlice/myBudgetSlice";
import globalSlice from "./globalSlice";
import financeSlice from "./financeSlice/financeSlice";
import noteSlice from "./NotesSlice/noteSlice";
import planSlice from "./planSlice/planSlice";
import tagSlice from "./tagSlice/tagSlice";

export const store = configureStore({
  reducer: {
    user: UserSlice,
    expInc: expSlice,
    Inc: incSlice,
    catalogs: catalogsSlice,
    budget: budgetSlice,
    global: globalSlice,
    finance: financeSlice,
    notes: noteSlice,
    plans: planSlice,
    tags: tagSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
