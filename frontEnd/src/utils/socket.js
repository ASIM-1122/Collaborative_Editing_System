// src/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

let socket = null;

export function initSocket(token) {
  if (socket && socket.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.warn("Socket connect error:", err.message);
  });

  return socket;
}

export function getSocket() {
  if (!socket)
    throw new Error("Socket not initialized. Call initSocket(token) first.");
  return socket;
}

// A helper to attach our collaboration-related listeners (returns unbind function)
export function subscribeToCollabEvents({
  onRequestReceived,
  onRequestAccepted,
  onRequestDeclined,
  onCollaboratorAdded,
}) {
  if (!socket) return () => {};

  if (onRequestReceived) socket.on("collabRequestReceived", onRequestReceived);
  if (onRequestAccepted) socket.on("collabRequestAccepted", onRequestAccepted);
  if (onRequestDeclined) socket.on("collabRequestDeclined", onRequestDeclined);
  if (onCollaboratorAdded) socket.on("collaboratorAdded", onCollaboratorAdded);

  return () => {
    if (onRequestReceived)
      socket.off("collabRequestReceived", onRequestReceived);
    if (onRequestAccepted)
      socket.off("collabRequestAccepted", onRequestAccepted);
    if (onRequestDeclined)
      socket.off("collabRequestDeclined", onRequestDeclined);
    if (onCollaboratorAdded)
      socket.off("collaboratorAdded", onCollaboratorAdded);
  };
}
