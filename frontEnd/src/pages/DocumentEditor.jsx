// pages/DocumentEditor.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useSelector } from 'react-redux';

const DocumentEditor = () => {
  const { id } = useParams();
  const user = useSelector(state => state.user.user); // fixed path to user
  const [doc, setDoc] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const fetchDoc = useCallback(async () => {
    try {
      const res = await api.get(`/document/${id}`);
      setDoc(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
      console.log(user)
    } catch (error) {
      console.error('Failed to fetch document:', error);
    }
  }, [id]);

  const handleSave = async () => {
    try {
      await api.put(`/document/update/${id}`, {
        title,
        content,
      });
      fetchDoc();
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  if (!doc) return <p className="p-6">Loading document...</p>;

  return (
    <div className="p-6">
      <input
        className="text-2xl font-bold w-full mb-4 border-b pb-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full h-96 border p-4 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
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
