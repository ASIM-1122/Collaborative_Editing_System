// utils/socketHelpers.js

let io;
let userSocketMap = new Map();

function initSocketIO(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    const userId = socket.handshake.auth?.userId;
    if (userId) {
      const set = userSocketMap.get(userId) || new Set();
      set.add(socket.id);
      userSocketMap.set(userId, set);
    }

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      if (userId) {
        const set = userSocketMap.get(userId) || new Set();
        set.delete(socket.id);
        if (set.size === 0) userSocketMap.delete(userId);
      }
    });
  });

  return io;
}

function sendSocketToUser(userId, eventName, payload) {
  const set = userSocketMap.get(userId);
  if (!set) return;
  for (const sid of set) {
    io.to(sid).emit(eventName, payload);
  }
}

function sendSocketToRoom(room, eventName, payload) {
  if (!io) return;
  io.to(room).emit(eventName, payload);
}

module.exports = {
  initSocketIO,
  sendSocketToUser,
  sendSocketToRoom,
};
