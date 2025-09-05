import React, { useState } from 'react'
import FormInput from '../components/FormInput'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, loading, error } = useSelector((state) => state.user)

  const [fullName, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const resultAction = await dispatch(registerUser({ fullName, email, password }))

      if (registerUser.fulfilled.match(resultAction)) {
        // Clear form on success
        setFullname('')
        setEmail('')
        setPassword('')
        // Navigate to dashboard after successful registration
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <FormInput
          label="Full name"
          value={fullName}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="btn bg-gradient-to-r from-accent to-accent2 text-black"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
