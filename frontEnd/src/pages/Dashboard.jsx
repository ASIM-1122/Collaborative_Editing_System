// pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from "../redux/documentSlice";
import DocumentCard from '../components/DocumentCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { documents, loading } = useSelector(state => state.document);
  
  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Documents</h2>
        <button
          onClick={() => navigate('/create-document')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Document
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map(doc => (
            <DocumentCard key={doc._id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
