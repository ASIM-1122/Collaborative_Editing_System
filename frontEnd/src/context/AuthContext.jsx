
import React, { createContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { toast, ToastContainer } from 'react-toastify'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) fetchProfile(t)
  }, [])

  async function fetchProfile(token){
    try{
      setLoading(true)
      const res = await api.get('/users/profile')
      setUser(res.data)
    }catch(err){
      console.error(err)
      localStorage.removeItem('token')
    }finally{ setLoading(false) }
  }

  async function login(email, password){
    const res = await api.post('/users/login', { email, password })
    const token = res.data.token
    localStorage.setItem('token', token)
    await fetchProfile()
    toast.success('Logged in')
  }

  async function register(fullname, email, password){
    const res = await api.post('/users/register', { fullname, email, password })
    const token = res.data.token
    localStorage.setItem('token', token)
    await fetchProfile()
    toast.success('Registered')
  }

  function logout(){
    localStorage.removeItem('token')
    setUser(null)
    toast.info('Logged out')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
      <ToastContainer position="top-right" />
    </AuthContext.Provider>
  )
}
