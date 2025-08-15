import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { updateDocument, fetchUserDocuments } from "../redux/documentSlice";

export default function ServiceDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { documents, loading } = useSelector((state) => state.document);
  const { user } = useSelector((state) => state.user); // ✅ fixed

  const doc = documents.find((d) => d._id === id);

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState([]);
  const socketRef = useRef(null);

  // Fetch user documents
  useEffect(() => {
    dispatch(fetchUserDocuments());
  }, [dispatch]);

  // Set content when doc is loaded
  useEffect(() => {
    if (doc) {
      setContent(doc.content || "");
    }
  }, [doc]);

  // Connect socket
  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:8000",
      { transports: ["websocket"] }
    );

    socketRef.current.emit("join-document", id);

    socketRef.current.on("receive-changes", ({ content: remote }) => {
      if (remote !== content) setContent(remote);
    });

    socketRef.current.on("document-saved", ({ content: remote }) => {
      setContent(remote);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id, content]);

  // Debounced autosave
  useEffect(() => {
    const t = setTimeout(() => handleSave(false), 3000);
    return () => clearTimeout(t);
  }, [content]);

  function handleLocalEdit(e) {
    const v = e.target.value;
    setContent(v);
    socketRef.current?.emit("send-changes", {
      documentId: id,
      content: v,
    });
  }

  async function handleSave() {
    try {
      setSaving(true);
      await dispatch(
        updateDocument({
          documentID: id,
          updatedData: { content, author: user?.id || user?.email },
        })
      ).unwrap();

      socketRef.current?.emit("save-document", {
        documentId: id,
        content,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function loadVersions() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/version/${id}`
      );
      const data = await res.json();
      setVersions(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRevert(versionId) {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/version/revert/${id}/${versionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            author: user?.id || user?.email,
          }),
        }
      );
      dispatch(fetchUserDocuments());
      loadVersions();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading || !doc) return <Loader />;

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
        onChange={handleLocalEdit}
        className="w-full h-96 p-4 rounded-lg bg-white/5 border border-white/6"
      />
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => handleSave(true)}
          className="btn bg-gradient-to-r from-accent to-accent2 text-black"
        >
          Save
        </button>
        <button
          onClick={loadVersions}
          className="btn bg-white/5"
        >
          Show Versions
        </button>
      </div>

      {versions.length > 0 && (
        <div className="mt-6 card">
          <h3 className="font-semibold mb-2">Version History</h3>
          <div className="flex flex-col gap-3">
            {versions.map((v) => (
              <div
                key={v._id}
                className="p-3 border rounded bg-white/3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-300">
                      {new Date(v.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      {v.content.slice(0, 120)}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleRevert(v._id)}
                      className="btn bg-white/5"
                    >
                      Revert
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
