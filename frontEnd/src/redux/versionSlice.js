// src/redux/versionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { versionApi } from '../utils/api';

// Fetch version history for a document
export const fetchVersions = createAsyncThunk(
  'versions/fetch',
  async (documentId, { rejectWithValue }) => {
    try {
      const res = await versionApi.get(`/versions/${documentId}`);
      return { documentId, versions: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch versions');
    }
  }
);

const versionSlice = createSlice({
  name: 'versions',
  initialState: {
    history: {}, // { documentId: [versions] }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVersions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVersions.fulfilled, (state, action) => {
        state.loading = false;
        state.history[action.payload.documentId] = action.payload.versions;
      })
      .addCase(fetchVersions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default versionSlice.reducer;
