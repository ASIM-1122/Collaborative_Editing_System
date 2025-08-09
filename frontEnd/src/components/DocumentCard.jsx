import React from 'react';
import { Link } from 'react-router-dom';

const DocumentCard = ({ doc }) => {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{doc.title}</h3>
      <h3 className="font-base text-lg">{doc.content}</h3>
      <p className="text-sm text-gray-500">Owner: {doc.ownerEmail || 'Unknown'}</p>
      <p className="text-sm">Last edited: {new Date(doc.updatedAt).toLocaleString()}</p>
      <Link to={`/document/${doc._id}`} className="text-blue-600 hover:underline">request to Collaborate</Link>
    </div>
  );
};

export default DocumentCard;