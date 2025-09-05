// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllDocuments } from "../redux/documentSlice";
import ServiceCard from "../components/ServiceCard";
import RequestsPanel from "../components/RequestsPanel";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { list, loading, error } = useSelector((s) => s.documents);

  useEffect(() => {
    dispatch(fetchAllDocuments());
  }, [dispatch]);

  const handleCreateNew = () => {
    navigate(`/createDocument`);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button
          onClick={handleCreateNew}
          className="w-full md:w-auto btn bg-gradient-to-r from-accent to-accent2 text-black px-4 py-2 rounded-lg shadow"
        >
          New Document
        </button>
      </div>

      {/* Responsive Layout: Left = Documents, Right = Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Documents Section */}
        <div className="lg:col-span-2">
          {loading ? (
            <p>Loading documents...</p>
          ) : error ? (
            <p className="text-red-600">{String(error?.message || error)}</p>
          ) : list.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {list.map((doc, index) => (
                <ServiceCard key={doc._id ?? index} doc={doc} />
              ))}
            </div>
          ) : (
            <p>No documents found.</p>
          )}
        </div>

        {/* Requests Panel */}
        <aside className="lg:col-span-1">
          <div className="bg-white shadow rounded-xl p-4 h-fit">
            <RequestsPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
