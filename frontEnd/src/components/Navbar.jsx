// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get user from Redux store
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout()); // ✅ Clear user from Redux
    navigate('/');      // ✅ Redirect to home
  };

  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between border-b border-white/6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent2"
        >
          CollabEdit
        </Link>
        <div className="text-sm text-slate-300 ml-2">Realtime Docs</div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/services" className="text-sm">
          Documents
        </Link>

        {user ? (
          <>
            {/* ✅ Keep Dashboard link when logged in */}
            <Link to="/dashboard" className="text-sm">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="btn bg-gradient-to-r from-accent to-accent2 text-black"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn bg-white/5">
              Login
            </Link>
            <Link
              to="/register"
              className="btn bg-gradient-to-r from-accent to-accent2 text-black"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
