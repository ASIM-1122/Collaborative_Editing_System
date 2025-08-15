// src/redux/documentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import documentApi from "../services/documentsApi";

// CREATE
export const createDocument = createAsyncThunk(
  "document/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await documentApi.post("/document/create", formData);
      return {
        ...data.newDocument,
        ownerEmail: data.ownerEmail,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

// FETCH ALL (PUBLIC)
export const fetchAllDocuments = createAsyncThunk(
  "document/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await documentApi.get("/document/fetchAllDocuments");
      return data.documents || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// FETCH USER DOCUMENTS
export const fetchUserDocuments = createAsyncThunk(
  "document/fetchUserDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await documentApi.get("/document/fetchUserDocuments");
      return data.documents || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// UPDATE
export const updateDocument = createAsyncThunk(
  "document/update",
  async ({ documentID, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await documentApi.put(
        `/document/updateDocument/${documentID}`,
        updatedData
      );
      return data.updatedDocument;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// DELETE
export const deleteDocument = createAsyncThunk(
  "document/delete",
  async (id, { rejectWithValue }) => {
    try {
      await documentApi.delete(`/document/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// REQUEST TO COLLABORATE
export const requestToCollaborate = createAsyncThunk(
  "document/requestToCollaborate",
  async (documentID, { rejectWithValue }) => {
    try {
      const { data } = await documentApi.post(
        `/document/addCollaborator/${documentID}`
      );
      return { documentID, message: data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Collaboration request failed"
      );
    }
  }
);

// SLICE
const documentSlice = createSlice({
  name: "document",
  initialState: {
    documents: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
      })

      // FETCH ALL
      .addCase(fetchAllDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchAllDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH USER DOCUMENTS
      .addCase(fetchUserDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
      })

      // UPDATE
      .addCase(updateDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(
          (doc) => doc._id === action.payload._id
        );
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => doc._id !== action.payload
        );
      })

      // REQUEST COLLABORATE
      .addCase(requestToCollaborate.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      });
  },
});

export const { clearMessages } = documentSlice.actions;
export default documentSlice.reducer;
