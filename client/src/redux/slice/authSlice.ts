import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

interface AuthState {
  currentUser: User;
  isAuthenticated: boolean;
}

const initialUser: User = {
  id: "u-1",
  name: "Dev Coder",
  email: "devcoderm13@gmail.com",
  role: "Developer",
  tier: "pro",
  joined: "2026-07-01",
  status: "active",
  credits: 1540
};

const initialState: AuthState = {
  currentUser: initialUser,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; name?: string }>) => {
      state.isAuthenticated = true;
      state.currentUser.email = action.payload.email;
      if (action.payload.name) {
        state.currentUser.name = action.payload.name;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload
      };
    }
  }
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
