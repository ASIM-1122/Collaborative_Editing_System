// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
