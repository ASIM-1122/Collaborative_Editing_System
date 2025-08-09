// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// ✅ REGISTER THUNK
export const registerUser = createAsyncThunk('user/registerUser', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/users/register', formData);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response.data.message || "Registration failed");
  }
});

// ✅ LOGIN THUNK
export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/login', formData);
      const { user, token } = res.data;

      // Store token locally (for header usage)
      localStorage.setItem('token', token); // or use cookies if needed

      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);


// ✅ LOGOUT THUNK
export const logoutUser = createAsyncThunk('user/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const res = await api.post('/users/logout');
    return res.data.message;
  } catch (err) {
    return rejectWithValue(err.response.data.message || "logout failed");
  }
});

// ✅ SLICE
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //LOGOUT
      .addCase(logoutUser.fulfilled,(state)=>{
        state.user = null;
      })
      .addCase(logoutUser.rejected,(state,action)=>{
        state.error = action.payload;
      });
  },
});

// ✅ EXPORTS
export const { logout } = userSlice.actions;
export default userSlice.reducer;
