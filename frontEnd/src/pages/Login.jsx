// src/pages/Login.jsx
import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handle(e) {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
    // If rejected, error will already be in Redux state
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handle} className="card">
        <FormInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <FormInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="btn bg-gradient-to-r from-accent to-accent2 text-black"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
