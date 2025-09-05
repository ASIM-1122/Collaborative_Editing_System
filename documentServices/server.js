// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db/database');
const documentRoutes = require('./routes/documentRoutes');
const documentRequestRoutes = require('./routes/documentRequests');
const documentModel = require('./models/documentModel');
const { initSocketIO, sendSocketToUser, sendSocketToRoom } = require('./utils/socketHelpers');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/document', documentRoutes);
app.use('/document-requests', documentRequestRoutes);

// Connect DB then start server
connectDB()
  .then(() => {
    const server = http.createServer(app);

    // ===============================
    // INIT SOCKET.IO (with CORS)
    // ===============================
    const io = initSocketIO(server);

    // ---- Token auth middleware ----
    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Authentication required'));

        const secret = process.env.JWT_SECRET || process.env.SECRET_KEY;
        const payload = jwt.verify(token, secret);

        socket.user = payload; // { id, email, ... }
        return next();
      } catch (err) {
        return next(new Error('Authentication error'));
      }
    });

    // ===============================
    // DOCUMENT COLLABORATION EVENTS
    // ===============================
    io.on('connection', (socket) => {
      const userId = socket.user?.id;
      console.log('✅ Socket connected', socket.id, 'user:', userId);

      // ---- join document ----
      socket.on('join-document', async (docId) => {
        if (!mongoose.Types.ObjectId.isValid(docId)) {
          socket.emit('error-message', 'Invalid document id');
          return;
        }

        const doc = await documentModel.findById(docId);
        if (!doc) {
          socket.emit('error-message', 'Document not found');
          return;
        }

        const isOwner = doc.owner?.toString() === userId;
        const isCollaborator = doc.collaborators?.some(c => c.toString() === userId);

        if (!doc.isPublic && !isOwner && !isCollaborator) {
          socket.emit('error-message', 'Access denied');
          return;
        }

        const room = `doc_${docId}`;
        socket.join(room);
        console.log(`👥 user ${userId} joined ${room}`);

        socket.emit('document-init', {
          document: { id: doc._id.toString(), title: doc.title, content: doc.content }
        });

        socket.to(room).emit('user-joined', { userId, socketId: socket.id });
      });

      // ---- live typing changes ----
      socket.on('send-changes', ({ documentId, index, insertedText, deletedCount, userId }) => {
        const room = `doc_${documentId}`;
        socket.to(room).emit('receive-changes', { index, insertedText, deletedCount, userId });
      });

      // ---- save to DB ----
      socket.on('save-document', async ({ documentId, content }) => {
        try {
          await documentModel.findByIdAndUpdate(documentId, {
            content,
            updatedAt: new Date()
          });
          const room = `doc_${documentId}`;
          io.to(room).emit('document-saved', { content });
        } catch (e) {
          console.error('Save failed', e);
        }
      });

      // ---- cursor presence ----
      socket.on('cursor-update', ({ documentId, cursor }) => {
        const room = `doc_${documentId}`;
        socket.to(room).emit('presence-cursor', { userId, cursor });
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected', socket.id);
      });
    });

    // ===============================
    // MAKE SOCKET HELPERS AVAILABLE
    // ===============================
    app.set('sendSocketToUser', sendSocketToUser);
    app.set('sendSocketToRoom', sendSocketToRoom);

    // ===============================
    // START SERVER
    // ===============================
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('DB connection failed', err);
  });
