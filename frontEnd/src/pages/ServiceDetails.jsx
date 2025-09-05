import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentById, updateDocument } from "../redux/documentSlice";
import Loader from "../components/Loader";
import { getSocket } from "../utils/socket";

export default function ServiceDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Use Redux, not Context
  const user = useSelector((s) => s.user?.user);
  const token = useSelector((s) => s.user?.token);

  const doc = useSelector((state) =>
    state.documents.list.find((d) => d._id === id)
  );

  const socketRef = useRef(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("");

  // Load doc from API into Redux, then local state
  useEffect(() => {
    if (!doc) {
      dispatch(fetchDocumentById(id));
    } else {
      setContent(doc.content || "");
      setLastSaved(doc.content || "");
    }
  }, [dispatch, id, doc]);

  // Setup socket (shared singleton)
  useEffect(() => {
    if (!id || !token) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    // Join the doc room
    socket.emit("join-document", id);

    // Server may send initial content via socket
    const onInit = (payload) => {
      const remote = payload?.document?.content ?? "";
      // Only set if we don't already have content from REST
      if (!doc && typeof remote === "string") {
        setContent(remote);
        setLastSaved(remote);
      }
    };

    const onReceive = ({ index, insertedText, deletedCount }) => {
      // Apply remote diff to local content
      setContent((prev) => {
        const safeIndex = Math.max(0, Math.min(index, prev.length));
        const del = Math.max(0, Math.min(deletedCount, prev.length - safeIndex));
        const before = prev.slice(0, safeIndex);
        const after = prev.slice(safeIndex + del);
        return before + (insertedText || "") + after;
      });
    };

    const onSaved = ({ content: remote }) => {
      setContent(remote);
      setLastSaved(remote);
    };

    const onError = (msg) => {
      console.error("[join-document:error]", msg);
      // Optional: show a toast to the user
      // e.g. toast.error(msg)
    };

    socket.on("document-init", onInit);
    socket.on("receive-changes", onReceive);
    socket.on("document-saved", onSaved);
    socket.on("error-message", onError);

    return () => {
      socket.off("document-init", onInit);
      socket.off("receive-changes", onReceive);
      socket.off("document-saved", onSaved);
      socket.off("error-message", onError);
      // do not disconnect; other parts of app may use the same socket
    };
  }, [id, token, doc]);

  // Debounced autosave
  useEffect(() => {
    if (content === lastSaved) return;
    const t = setTimeout(() => {
      handleSave(false);
    }, 3000);
    return () => clearTimeout(t);
  }, [content, lastSaved]);

  // Local edit → compute diff → emit
  function handleLocalEdit(e) {
    const newValue = e.target.value;
    const prevValue = content;

    // Fast diff (single span)
    let start = 0;
    while (
      start < newValue.length &&
      start < prevValue.length &&
      newValue[start] === prevValue[start]
    ) {
      start++;
    }

    let prevEnd = prevValue.length;
    let newEnd = newValue.length;
    while (
      prevEnd > start &&
      newEnd > start &&
      prevValue[prevEnd - 1] === newValue[newEnd - 1]
    ) {
      prevEnd--;
      newEnd--;
    }

    const deletedCount = Math.max(0, prevEnd - start);
    const insertedText = newValue.slice(start, newEnd);

    setContent(newValue);

    // Emit diff (no need to include userId; server excludes sender)
    socketRef.current?.emit("send-changes", {
      documentId: id,
      index: start,
      insertedText,
      deletedCount,
    });
  }

  async function handleSave(showToast = true) {
    if (!doc) return;
    try {
      setSaving(true);
      const updates = { content, author: user?._id || user?.email };
      const resultAction = await dispatch(updateDocument({ id, updates }));
      if (updateDocument.fulfilled.match(resultAction)) {
        socketRef.current?.emit("save-document", { documentId: id, content });
        setLastSaved(content);
        // if (showToast) toast.success("Saved!")
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  if (!doc) return <Loader />;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{doc.title}</h2>
        <div className="text-sm text-slate-400">
          {saving ? "Saving..." : "Saved"}
        </div>
      </div>

      <textarea
        value={content}
        onChange={handleLocalEdit}       // use onChange in React
        className="w-full h-96 p-4 rounded-lg bg-white/5 border border-white/6"
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => handleSave(true)}
          className="btn bg-gradient-to-r from-accent to-accent2 text-black"
        >
          Save
        </button>
      </div>
    </div>
  );
}
