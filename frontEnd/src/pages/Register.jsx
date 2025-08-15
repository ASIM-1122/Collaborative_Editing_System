// src/pages/Register.jsx
import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error } = useSelector((state) => state.user);

  async function handle(e) {
    e.preventDefault();
    const result = await dispatch(registerUser({ fullname, email, password }));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handle} className="card space-y-4">
        <FormInput
          label="Full name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
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
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
