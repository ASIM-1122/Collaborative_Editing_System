// src/components/RequestsPanel.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOwnerRequests,
  acceptCollabRequest,
  declineCollabRequest,
} from "../redux/documentSlice";

export default function RequestsPanel() {
  const dispatch = useDispatch();
  const { requests, requestsLoading } = useSelector((s) => s.documents);

  useEffect(() => {
    dispatch(fetchOwnerRequests());
  }, [dispatch]);

  if (requestsLoading) return <p>Loading requests...</p>;
  if (!requests || requests.length === 0) return <p>No pending requests</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Collaboration Requests</h3>
      <ul>
        {requests.map((r) => (
          <li key={r._id} className="p-2 border rounded mb-2">
            <div>
              <strong>
                {typeof r.requester === "object"
                  ? r.requester?.name || r.requester?.email
                  : r.requester}
              </strong>{" "}
              requested access to{" "}
              <em>
                {typeof r.document === "object"
                  ? r.document?.title
                  : r.document}
              </em>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() =>
                  dispatch(acceptCollabRequest({ requestId: r._id }))
                }
                className="px-2 py-1 bg-green-500 text-white rounded"
              >
                Accept
              </button>
              <button
                onClick={() =>
                  dispatch(declineCollabRequest({ requestId: r._id }))
                }
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
