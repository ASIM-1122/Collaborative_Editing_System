// src/SocketProvider.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initSocket, subscribeToCollabEvents } from "./utils/socket";
import { pushIncomingRequest, addCollaboratorLocal, fetchOwnerRequests } from "./redux/documentSlice";

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // not logged in

    const socket = initSocket(token);

    const unbind = subscribeToCollabEvents({
      onRequestReceived: (payload) => {
        // payload example: { requestId, document: { _id, title }, requester, message }
        console.log("request received via socket", payload);
        // add to redux requests so owner sees it
        dispatch(pushIncomingRequest(payload));
        // optional: open toast / notification UI
      },
      onRequestAccepted: (payload) => {
        // payload example: { requestId, document: { _id, title }, ... }
        console.log("request accepted", payload);
        // update document data locally
        dispatch(addCollaboratorLocal({ documentId: payload.document._id, userId: payload.requesterId || payload.addedUserId }));
      },
      onRequestDeclined: (payload) => {
        console.log("request declined", payload);
        // optionally update requests list
        dispatch(fetchOwnerRequests()); // refresh list
      },
      onCollaboratorAdded: (payload) => {
        // if owner accepted via other UI, both get an update
        dispatch(addCollaboratorLocal({ documentId: payload.documentId, userId: payload.userId }));
      },
    });

    // cleanup on unmount
    return () => {
      unbind();
      try { socket.disconnect(); } catch (e) {}
    };
  }, [dispatch]);

  return children;
}
