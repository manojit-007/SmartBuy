import apiClient from "@/ApiClient/ApiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/user/me", {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const AuthSlice = createSlice({
  name: "order",
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetSuccess(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { resetError, resetSuccess } = AuthSlice.actions;

export default AuthSlice.reducer;
