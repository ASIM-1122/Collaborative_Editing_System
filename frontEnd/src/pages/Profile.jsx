// pages/Profile.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector(state => state.user);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
      </div>
    </div>
  );
};

export default Profile;
