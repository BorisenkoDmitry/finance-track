import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import api from "../Api/api";
import { extractApiError, getErrorMessage, type ApiErrorPayload } from "../types/api";

export type UserRole = "NoPaydUser" | "SuperAdmin" | "PaydUser" | "BetaUser";

type User = {
  name: string;
  surname: string;
  password: string;
  email: string;
  roles: Array<{ id: string; name: string }>;
  imageUrl: string | null;
};

type UserState = {
  isLoading: boolean;
  user: UserMeReq;
  list: UserReq[];
  RoleList: { id: string; name: UserRole }[];
  isLoadingImage: boolean;
  isChangedPassword: boolean;
};

const userState: UserState = {
  isLoading: false,
  user: null,
  list: [],
  RoleList: [],
  isLoadingImage: false,
  isChangedPassword: false,
};

export type UserReq = {
  roles: { id: string; name: string }[];
  email: string;
  id: string;
  name: string;
  surname: string;
  imageUrl: string | null;
};

type UserMeReq = {
  result: boolean;
  user: UserReq;
};

export const userMe = createAsyncThunk<UserMeReq>(
  "userMe",
  async (_, { rejectWithValue }) => {
    try {
      const d = await api.get<{ result: boolean }>("auth/me");
      return d.data as UserMeReq;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

type IChangePasswordDTO = {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
};

export const changePassword = createAsyncThunk<UserMeReq, IChangePasswordDTO>(
  "changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const d = await api.post<{ result: boolean }>(
        "auth/change-password",
        data
      );
      return d.data as UserMeReq;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

export const uploadImage = createAsyncThunk<UserMeReq, { avatar: File }>(
  "uploadImage",
  async ({ avatar }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("file", avatar);
    try {
      const d = await api.post<UserMeReq>("avatar/upload", formData);
      return d.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

export const deleteImage = createAsyncThunk<UserMeReq>(
  "deleteImage",
  async (_, { rejectWithValue }) => {
    try {
      const d = await api.delete<UserMeReq>("avatar/delete");
      return d.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

export const usersGetApi = createAsyncThunk<UserReq[]>(
  "usersGet",
  async (_, { rejectWithValue }) => {
    try {
      const d = await api.get<UserReq[]>("auth");
      return d.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

export const userDeleteApi = createAsyncThunk<void, string>(
  "userDeleteApi",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`auth/${id}`);
      return undefined;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

export const changeUserRole = createAsyncThunk<
  boolean,
  { roleID: string; userID: string }
>("changeUserRole", async ({ roleID, userID }, { rejectWithValue }) => {
  try {
    const res = await api.post<{ result: boolean }>(`auth/change-role`, {
      roleID,
      userID,
    });
    return res.data.result;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const RoleGetApi = createAsyncThunk<{ id: string; name: UserRole }[]>(
  "rolesGet",
  async (_, { rejectWithValue }) => {
    try {
      const d = await api.get<{ id: string; name: UserRole }[]>("roles");
      return d.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

export const logoutApi = createAsyncThunk(
  "userLogout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("auth/logout");
    } catch {
      // ignore — server may reject if token already expired
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return rejectWithValue("logout");
  }
);

type loginDTO = {
  email: string;
  password: string;
};

type loginRes = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export const loginApi = createAsyncThunk<loginRes, loginDTO>(
  "userLogin",
  async (obj, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("auth/login", obj);
      const data = res.data as loginRes;
      localStorage.setItem("token", JSON.stringify(data.accessToken));
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", JSON.stringify(
          typeof data.refreshToken === "object" ? data.refreshToken.token : data.refreshToken
        ));
      }
      return data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    } finally {
      dispatch(userMe());
    }
  }
);

type createUserDto = {
  email: string;
  phone: string;
  password: string;
  name: string;
  surname: string;
};

type createUserRes = {
  email: string;
  phone: string;
  name: string;
  surname: string;
  roles?: UserRole[];
};

export const createUserApi = createAsyncThunk<createUserRes, createUserDto>(
  "userCreate",
  async (obj, { rejectWithValue }) => {
    try {
      return await api.post<createUserRes>("auth/register", obj).then((res) => {
        window.location.href = window.location.origin + "/auth/login";
        return res.data;
      });
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: userState,
  reducers: {
    resetIsChanged: (state) => {
      state.isChangedPassword = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userMe.pending, (state) => {
      state.isLoading = true;
      state.user = null;
    });
    builder.addCase(userMe.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
    });
    builder.addCase(userMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(createUserApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      createUserApi.rejected,
      (state, action) => {
        state.isLoading = false;
        toast.error(getErrorMessage(action.payload as ApiErrorPayload));
      }
    );

    builder.addCase(createUserApi.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(loginApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginApi.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(loginApi.fulfilled, (state) => {
      state.isLoading = false;
    });

    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(getErrorMessage(action.payload as ApiErrorPayload));
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isChangedPassword = action.payload.result;
    });

    builder.addCase(usersGetApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(usersGetApi.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(usersGetApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.list = action.payload;
    });

    builder.addCase(RoleGetApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(RoleGetApi.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(RoleGetApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.RoleList = action.payload;
    });

    builder.addCase(changeUserRole.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changeUserRole.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(changeUserRole.fulfilled, (state) => {
      state.isLoading = false;
    });

    builder.addCase(userDeleteApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userDeleteApi.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(userDeleteApi.fulfilled, (state) => {
      state.isLoading = false;
    });

    builder.addCase(uploadImage.pending, (state) => {
      state.isLoadingImage = true;
    });

    builder.addCase(uploadImage.rejected, (state) => {
      state.isLoadingImage = false;
    });

    builder.addCase(uploadImage.fulfilled, (state, action) => {
      state.isLoadingImage = false;
      state.user = action.payload;
    });

    builder.addCase(deleteImage.pending, (state) => {
      state.isLoadingImage = true;
    });

    builder.addCase(deleteImage.rejected, (state) => {
      state.isLoadingImage = false;
    });

    builder.addCase(deleteImage.fulfilled, (state, action) => {
      state.isLoadingImage = false;
      state.user = action.payload;
    });

    builder.addCase(logoutApi.rejected, (state) => {
      state.user = null;
      state.isLoading = false;
    });
  },
});

// Извлекаем объект с создателями и редуктор
const { reducer, actions } = userSlice;
// Извлекаем и экспортируем каждого создателя по названию
export const { resetIsChanged } = actions;
// Экпортируем редуктор по умолчанию или по названию
export default reducer;
