import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  loginAdmin,
  registerAdmin,
  updateUserProfile,
} from "../../services/authService";

const STORAGE_KEY = "electromart_auth";

const loadStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistAuth = (account) => {
  if (account) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const stored = loadStoredAuth();

const initialState = {
  account: stored, // { id, name, email, role: 'user'|'admin', avatar, ... }
  isAuthenticated: !!stored,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

export const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  return await loginUser(email, password);
});

export const register = createAsyncThunk("auth/register", async (payload) => {
  return await registerUser(payload);
});

export const adminLogin = createAsyncThunk("auth/adminLogin", async ({ email, password }) => {
  return await loginAdmin(email, password);
});

export const adminRegister = createAsyncThunk("auth/adminRegister", async (payload) => {
  return await registerAdmin(payload);
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ userId, updates }) => {
    return await updateUserProfile(userId, updates);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.account = null;
      state.isAuthenticated = false;
      persistAuth(null);
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.status = "loading";
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    };
    const handleSuccess = (state, action) => {
      state.status = "succeeded";
      state.account = action.payload;
      state.isAuthenticated = true;
      persistAuth(action.payload);
    };

    builder
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, handleSuccess)
      .addCase(login.rejected, handleRejected)

      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, handleSuccess)
      .addCase(register.rejected, handleRejected)

      .addCase(adminLogin.pending, handlePending)
      .addCase(adminLogin.fulfilled, handleSuccess)
      .addCase(adminLogin.rejected, handleRejected)

      .addCase(adminRegister.pending, handlePending)
      .addCase(adminRegister.fulfilled, handleSuccess)
      .addCase(adminRegister.rejected, handleRejected)

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.account = { ...state.account, ...action.payload };
        persistAuth(state.account);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
