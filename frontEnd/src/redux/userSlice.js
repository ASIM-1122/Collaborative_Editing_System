// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../utils/api';

// Get initial state from localStorage
const userData = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const tokenData = localStorage.getItem('token') || null;

const initialState = {
  user: userData,
  token: tokenData,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await userApi.post('/users/login', credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await userApi.post('/users/register', credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Registration failed');
    }
  }
);


export const fetchUserProfile = createAsyncThunk(
  'user/profile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.token || localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('No token found');
      }

      const res = await userApi.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; // Expecting user profile data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch profile');
    }
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile
    .addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user || action.payload; // depends on backend
      // optional: refresh localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
    })
    .addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
