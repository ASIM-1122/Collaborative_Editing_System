// src/redux/documentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import documentApi from "../services/documentsApi";

/* ===========================
   Existing Thunks (kept intact)
   =========================== */

// Fetch all documents (accessible to user, admin, public etc.)
export const fetchAllDocuments = createAsyncThunk(
  "documents/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await documentApi.get("/document/fetchAllDocuments");
      return Array.isArray(res.data?.documents) ? res.data.documents : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch documents"
      );
    }
  }
);

// Fetch single document by ID
export const fetchDocumentById = createAsyncThunk(
  "documents/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await documentApi.get(`/document/fetchDocumentById/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch document"
      );
    }
  }
);

// Create a new document
export const createDocument = createAsyncThunk(
  "documents/create",
  async (docData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const ownerId = state.user?.user?._id || null;

      if (!ownerId) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      const payload = { ...docData, owner: ownerId };
      const res = await documentApi.post("/document/create", payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to create document"
      );
    }
  }
);

// Update document
export const updateDocument = createAsyncThunk(
  "documents/update",
  async ({ id, updates }, thunkAPI) => {
    try {
      const res = await documentApi.put(
        `/document/updateDocument/${id}`,
        updates
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update document"
      );
    }
  }
);

// Delete document
export const deleteDocument = createAsyncThunk(
  "documents/delete",
  async (id, thunkAPI) => {
    try {
      await documentApi.delete(`/document/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete document"
      );
    }
  }
);

// Add collaborator (direct, owner-only)
export const addCollaborator = createAsyncThunk(
  "documents/addCollaborator",
  async ({ documentID, collaboratorData }, thunkAPI) => {
    try {
      const res = await documentApi.post(
        `/document/addCollaborator/${documentID}`,
        collaboratorData
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to add collaborator"
      );
    }
  }
);

/* ===========================
   New Thunks: Collaboration Requests
   =========================== */

// Send collaboration request (for non-owners)
export const sendCollabRequest = createAsyncThunk(
  "documents/sendCollabRequest",
  async ({ documentID, message = "" }, thunkAPI) => {
    try {
      const token =
        thunkAPI.getState().user?.token || localStorage.getItem("token");
      const res = await documentApi.post(
        `/document-requests/requestCollaborator/${documentID}`,
        { message },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return res.data; // { message, request }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to send collaboration request"
      );
    }
  }
);

// Owner: fetch pending requests
export const fetchOwnerRequests = createAsyncThunk(
  "documents/fetchOwnerRequests",
  async (_, thunkAPI) => {
    try {
      const token =
        thunkAPI.getState().user?.token || localStorage.getItem("token");
      const res = await documentApi.get("/document-requests/requests", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data?.requests || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch collaboration requests"
      );
    }
  }
);

// Accept request (owner only)
export const acceptCollabRequest = createAsyncThunk(
  "documents/acceptCollabRequest",
  async ({ requestId }, thunkAPI) => {
    try {
      const token =
        thunkAPI.getState().user?.token || localStorage.getItem("token");
      const res = await documentApi.post(
        `/document-requests/requests/${requestId}/accept`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return res.data; // { message, document, request }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to accept request"
      );
    }
  }
);

// Decline request (owner only)
export const declineCollabRequest = createAsyncThunk(
  "documents/declineCollabRequest",
  async ({ requestId }, thunkAPI) => {
    try {
      const token =
        thunkAPI.getState().user?.token || localStorage.getItem("token");
      const res = await documentApi.post(
        `/document-requests/requests/${requestId}/decline`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return res.data; // { message, request }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to decline request"
      );
    }
  }
);

/* ===========================
   Slice
   =========================== */

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    list: [],
    currentDocument: null,
    typingUsers: {},

    // states for documents
    loading: false,
    error: null,

    // new states for requests
    requests: [],
    requestsLoading: false,
    requestsError: null,
    sendRequestStatus: "idle",
    sendRequestError: null,
  },
  reducers: {
    setCurrentDocument(state, action) {
      state.currentDocument = action.payload;
    },
    userStartedTyping(state, action) {
      const { userId, username } = action.payload;
      state.typingUsers[userId] = username;
    },
    userStoppedTyping(state, action) {
      delete state.typingUsers[action.payload];
    },

    // realtime helpers (via socket)
    pushIncomingRequest(state, action) {
      state.requests.unshift(action.payload);
    },
    addCollaboratorLocal(state, action) {
      const { documentId, userId } = action.payload;

      const idx = state.list.findIndex((d) => d._id === documentId);
      if (idx !== -1) {
        const doc = state.list[idx];
        if (!doc.collaborators) doc.collaborators = [];
        if (!doc.collaborators.includes(userId))
          doc.collaborators.push(userId);
      }

      if (state.currentDocument?._id === documentId) {
        if (!state.currentDocument.collaborators)
          state.currentDocument.collaborators = [];
        if (!state.currentDocument.collaborators.includes(userId))
          state.currentDocument.collaborators.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* ----- Documents: existing extraReducers ----- */
      .addCase(fetchAllDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDocumentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((doc) => doc._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        else state.list.push(action.payload);
        state.currentDocument = action.payload;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        state.currentDocument = action.payload;
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((doc) => doc._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.currentDocument?._id === action.payload._id)
          state.currentDocument = action.payload;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((doc) => doc._id !== action.payload);
        if (state.currentDocument?._id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCollaborator.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDoc = action.payload;
        const idx = state.list.findIndex((doc) => doc._id === updatedDoc._id);
        if (idx !== -1) state.list[idx] = updatedDoc;
        if (state.currentDocument?._id === updatedDoc._id)
          state.currentDocument = updatedDoc;
      })
      .addCase(addCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ----- Requests: new extraReducers ----- */
      .addCase(sendCollabRequest.pending, (state) => {
        state.sendRequestStatus = "pending";
        state.sendRequestError = null;
      })
      .addCase(sendCollabRequest.fulfilled, (state) => {
        state.sendRequestStatus = "succeeded";
      })
      .addCase(sendCollabRequest.rejected, (state, action) => {
        state.sendRequestStatus = "failed";
        state.sendRequestError = action.payload;
      })

      .addCase(fetchOwnerRequests.pending, (state) => {
        state.requestsLoading = true;
        state.requestsError = null;
      })
      .addCase(fetchOwnerRequests.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchOwnerRequests.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.payload;
      })

      .addCase(acceptCollabRequest.pending, (state) => {
        state.requestsLoading = true;
        state.requestsError = null;
      })
      .addCase(acceptCollabRequest.fulfilled, (state, action) => {
        state.requestsLoading = false;
        const updatedDoc = action.payload?.document;
        const acceptedRequest = action.payload?.request;
        if (acceptedRequest?._id) {
          state.requests = state.requests.filter(
            (r) => r._id !== acceptedRequest._id
          );
        }
        if (updatedDoc) {
          const idx = state.list.findIndex((d) => d._id === updatedDoc._id);
          if (idx !== -1) state.list[idx] = updatedDoc;
          else state.list.push(updatedDoc);
          if (state.currentDocument?._id === updatedDoc._id)
            state.currentDocument = updatedDoc;
        }
      })
      .addCase(acceptCollabRequest.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.payload;
      })

      .addCase(declineCollabRequest.pending, (state) => {
        state.requestsLoading = true;
        state.requestsError = null;
      })
      .addCase(declineCollabRequest.fulfilled, (state, action) => {
        state.requestsLoading = false;
        const declinedRequest = action.payload?.request;
        if (declinedRequest?._id) {
          state.requests = state.requests.filter(
            (r) => r._id !== declinedRequest._id
          );
        }
      })
      .addCase(declineCollabRequest.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.payload;
      });
  },
});

/* ===========================
   Exports
   =========================== */
export const {
  setCurrentDocument,
  userStartedTyping,
  userStoppedTyping,
  pushIncomingRequest,
  addCollaboratorLocal,
} = documentSlice.actions;

export default documentSlice.reducer;
