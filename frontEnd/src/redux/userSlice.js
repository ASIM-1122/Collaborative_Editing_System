// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// ✅ Check token & fetch current user from /users/profile
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('No token found');

      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.user; // must match backend return
    } catch (err) {
      return rejectWithValue('Invalid or expired token');
    }
  }
);

// ✅ REGISTER
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/register', formData);
      const { user, token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/login', formData);
      const { user, token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// ✅ LOGOUT
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/users/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

// Load user from localStorage if available
const storedUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: storedUser,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })

      // ✅ Register
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

      // ✅ Login
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

      // ✅ Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
