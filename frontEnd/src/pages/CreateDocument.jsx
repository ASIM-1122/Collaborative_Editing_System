import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createDocument } from '../redux/documentSlice';

export default function CreateDocument() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
const { loading, error } = useSelector((state) => state.documents);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validation
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    // Build payload according to backend expectations
    const payload = {
      title: title.trim(),
      content: content.trim(),
      isPublic,
      userId: user?._id, // or 'createdBy' if backend uses that
    };

    const resultAction = await dispatch(createDocument(payload));

    if (createDocument.fulfilled.match(resultAction)) {
      alert('Document created successfully!');
      navigate('/dashboard');
    } else {
      alert(`Error: ${resultAction.payload || 'Failed to create document'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Create New Document
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              rows={8}
              className="w-full px-4 py-2 border text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Public checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-gray-700">Make this document public</label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Document'}
          </button>

          {/* Error message */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
