// src/components/ServiceCard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteDocument, sendCollabRequest } from "../redux/documentSlice";

export default function ServiceCard({ doc }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      dispatch(deleteDocument(doc._id));
    }
  };

  const handleAddCollaborator = () => {
    navigate(`/services/${doc._id}/add-collaborator`);
  };

  const handleRequestCollaborate = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // prevent owner from requesting their own doc
    if (user._id === (doc.owner?._id || doc.owner)) {
      alert("You are the owner of this document.");
      return;
    }

    setSending(true);
    try {
      const payload = { documentID: doc._id, message: "" }; // optional message
      const resultAction = await dispatch(sendCollabRequest(payload)).unwrap();
      // resultAction is res.data from backend
      setSent(true);
      alert(resultAction.message || "Request sent.");
    } catch (err) {
      console.error("Request failed", err);
      alert(err?.message || "Failed to send request.");
    } finally {
      setSending(false);
    }
  };

  const canOpen = user?._id === (doc.owner?._id || doc.owner) || doc.collaborators?.includes(user?._id);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all w-full md:w-1/3 flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
        {doc.content?.slice(0, 120) || "No content yet"}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
        <span className="text-xs text-gray-400">
          Updated {new Date(doc.updatedAt).toLocaleString()}
        </span>

        <div className="flex gap-2">
          {canOpen ? (
            <Link
              to={`/services/${doc._id}`}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition"
            >
              Open to update
            </Link>
          ) : (
            <button
              onClick={handleRequestCollaborate}
              disabled={sending || sent}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition disabled:opacity-60"
            >
              {sending ? "Sending..." : sent ? "Request sent" : "Request to Collaborate"}
            </button>
          )}

          {user?._id === (doc.owner?._id || doc.owner) && (
            <>
              <button
                onClick={handleAddCollaborator}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition"
              >
                Add Collaborator
              </button>

              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
