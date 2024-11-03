import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      dispatch(
        showToastMessage({
          message: `${response.data.user.name}님 환영합니다.`,
          status: "success",
        })
      );
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      // 실패 시 생긴 에러 값을 reducer에 저장
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {
  sessionStorage.removeItem("token");
  dispatch(userSlice.actions.clearUser());
  dispatch(
    showToastMessage({ message: "로그아웃 되었습니다.", status: "info" })
  );
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다!",
          status: "success",
        })
      );
      navigate("/login");
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        if (!action.payload) {
          state.loginError =
            "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
        } else {
          state.loginError = action.payload;
        }
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
        if (!action.payload) {
          state.loginError =
            "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
        } else {
          state.loginError = action.payload;
        }
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});
export const { clearErrors, clearUser } = userSlice.actions;
export default userSlice.reducer;
