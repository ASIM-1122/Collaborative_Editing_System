// pages/DocumentEditor.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchDocumentById, updateDocument } from "../redux/documentSlice";
import { addVersion } from "../redux/versionSlice";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Adjust for your backend

const DocumentEditor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { document, loading } = useSelector((state) => state.documents);
  const { user } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch document from Redux/Backend
  const fetchDoc = useCallback(() => {
    dispatch(fetchDocumentById(id));
  }, [dispatch, id]);

  // Handle Save
  const handleSave = () => {
    dispatch(updateDocument({ id, title, content }))
      .unwrap()
      .then((updatedDoc) => {
        // Store new version in Redux
        dispatch(
          addVersion({
            documentId: id,
            content,
            title,
            updatedBy: user?.name || "Unknown",
            updatedAt: new Date().toISOString(),
          })
        );

        // Emit save event to other clients
        socket.emit("save-document", {
          documentId: id,
          title,
          content,
          user: user?.name,
        });
      });
  };

  // Listen for socket updates
  useEffect(() => {
    socket.emit("join-document", id);

    socket.on("document-updated", (data) => {
      if (data.documentId === id) {
        setTitle(data.title);
        setContent(data.content);
      }
    });

    return () => {
      socket.off("document-updated");
    };
  }, [id]);

  // Sync local state when Redux document changes
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  if (loading) return <p className="p-6">Loading document...</p>;

  return (
    <div className="p-6">
      <input
        className="text-2xl font-bold w-full mb-4 border-b pb-1"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          socket.emit("edit-document", {
            documentId: id,
            title: e.target.value,
            content,
            user: user?.name,
          });
        }}
      />
      <textarea
        className="w-full h-96 border p-4 rounded"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          socket.emit("edit-document", {
            documentId: id,
            title,
            content: e.target.value,
            user: user?.name,
          });
        }}
      />
      <button
        onClick={handleSave}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default DocumentEditor;
