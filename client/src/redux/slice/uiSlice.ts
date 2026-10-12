import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  apiLoadingCount: number;
}

const initialState: UiState = {
  apiLoadingCount: 0,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    incrementLoading: (state) => {
      state.apiLoadingCount += 1;
    },
    decrementLoading: (state) => {
      state.apiLoadingCount = Math.max(0, state.apiLoadingCount - 1);
    },
  },
});

export const { incrementLoading, decrementLoading } = uiSlice.actions;
export default uiSlice.reducer;
