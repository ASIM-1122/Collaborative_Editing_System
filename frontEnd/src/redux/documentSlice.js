// src/redux/documentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentApi from '../services/documentsApi'; // ✅ updated import

// CREATE
export const createDocument = createAsyncThunk(
  'document/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await documentApi.post('/document/create', formData);
      // Include ownerEmail in returned object
      return {
        ...data.newDocument,
        ownerEmail: data.ownerEmail
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);


// FETCH
export const fetchDocuments = createAsyncThunk(
  'document/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await documentApi.get('/document/all');
      return data.documents || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// UPDATE
export const updateDocument = createAsyncThunk(
  'document/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await documentApi.put(`/document/update/${id}`, updatedData);
      return data.updatedDocument;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// DELETE
export const deleteDocument = createAsyncThunk(
  'document/delete',
  async (id, { rejectWithValue }) => {
    try {
      await documentApi.delete(`/document/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// SLICE remains same


// ✅ SLICE
const documentSlice = createSlice({
  name: 'document',
  initialState: {
    documents: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ➕ CREATE
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
      })

      // 🔁 FETCH
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ UPDATE
      .addCase(updateDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(doc => doc._id === action.payload._id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })

      // ❌ DELETE
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc._id !== action.payload);
      });
  },
});

export default documentSlice.reducer;
