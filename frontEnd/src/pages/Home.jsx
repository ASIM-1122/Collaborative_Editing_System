import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDocuments } from '../redux/documentSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { documents } = useSelector((state) => state.document);

  // Fetch documents when home loads
  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  // Handle create document
  const handleCreateDocument = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/create-document');
    }
  };

  // Handle add collaborator (example behavior)
  const handleCollaborate = () => {
    if (!user) {
      navigate('/login');
    } else {
      // logic like open modal, or navigate to collaborator form etc.
    navigate(`/edit-document}`);    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">CollabDocs</h1>
          <button
            onClick={handleCreateDocument}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Document
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Public Documents</h2>

        {documents?.length === 0 ? (
          <p className="text-gray-600">No public documents available.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-gray-800">{doc.title}</h3>
                <p className="text-gray-600 mt-1">{doc.content.slice(0, 100)}...</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Owner: {doc.ownerEmail || "User"}</span>
                  <button
                    onClick={() => handleCollaborate()}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
