import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toastMessage: { message: "", status: "" },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToastMessage(state, action) {
      state.toastMessage = {
        message: action.payload.message,
        status: action.payload.status,
      };
    },
    hideToastMessage(state) {
      state.open = false;
    },
    clearToastMessage: (state) => {
      state.toastMessage = null;
    },
  },
});

export const { showToastMessage, hideToastMessage, clearToastMessage } =
  uiSlice.actions;
export default uiSlice.reducer;
