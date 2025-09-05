// pages/EditDocument.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDocumentById, updateDocument } from "../redux/documentSlice";
import { addVersion } from "../redux/versionSlice";

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { document, loading, error } = useSelector((state) => state.documents);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch document data
  const loadDocument = useCallback(() => {
    dispatch(fetchDocumentById(id));
  }, [dispatch, id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Populate form once document is loaded
  useEffect(() => {
    if (document) {
      setTitle(document.title || "");
      setContent(document.content || "");
      setIsPublic(document.isPublic || false);
    }
  }, [document]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      updateDocument({ id, title, content, isPublic })
    );

    if (result.meta.requestStatus === "fulfilled") {
      // Store version in history
      dispatch(
        addVersion({
          documentId: id,
          title,
          content,
          updatedBy: user?.name || "Unknown",
          updatedAt: new Date().toISOString(),
        })
      );

      alert("Document updated successfully!");
      navigate(`/document/${id}`);
    } else {
      alert("Error: " + (result.payload || "Unknown error"));
    }
  };

  if (loading && !document) {
    return <p className="p-6">Loading document...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Edit Your Document
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              rows={8}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-gray-700">
              Make this document public
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Editing..." : "Save Changes"}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditDocument;
