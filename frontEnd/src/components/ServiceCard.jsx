import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteDocument, requestToCollaborate } from "../redux/documentSlice";

export default function ServiceCard({ doc }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      dispatch(deleteDocument(doc._id));
    }
  };

  const handleCollaborate = () => {
    dispatch(requestToCollaborate(doc._id))
      .unwrap()
      .then((res) => alert(res.message))
      .catch((err) => alert(err));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between w-full sm:w-64 md:w-72 lg:w-80 min-h-[270px]">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
        {doc.title}
      </h3>

      {/* Owner */}
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-medium">Owner:</span>{" "}
        {doc.ownerEmail || "Unknown"}
      </p>

      {/* Content preview */}
      <p className="text-sm text-gray-600 flex-grow line-clamp-3">
        {doc.content?.slice(0, 120) || "No content yet"}
      </p>

      {/* Last updated */}
      <div className="text-xs text-gray-400 mt-3">
        Updated {new Date(doc.updatedAt).toLocaleString()}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Link
          to={`/services/${doc._id}`}
          className="flex-1 text-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Open
        </Link>
        <button
          onClick={handleCollaborate}
          className="flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Request to Collaborate
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
