import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDocuments, createDocument } from "../redux/documentSlice";
import ServiceCard from "../components/ServiceCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { documents, loading, error } = useSelector((state) => state.document);

  useEffect(() => {
    if (user) {
      dispatch(fetchAllDocuments());
    }
  }, [dispatch, user]);

  const handleCreateNew = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const title = "Untitled";
    try {
      const newDoc = await dispatch(
        createDocument({
          title,
          content: "",
          isPublic: false,
        })
      ).unwrap();

      // ✅ Redirect directly to the editor for that doc
      navigate(`/createDocument/${newDoc._id}`);
    } catch (err) {
      console.error("Error creating document:", err);
    }
  };

  const myDocs = documents?.filter(
    (d) =>
      d.owner?._id === (user?.id || user?._id) ||
      d.collaborators?.includes(user?.id || user?._id)
  ) || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button
          onClick={handleCreateNew}
          className="btn bg-gradient-to-r from-accent to-accent2 text-black"
        >
          New Document
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {myDocs.map((d) => (
          <ServiceCard key={d._id} doc={d} />
        ))}
      </div>
    </div>
  );
}
