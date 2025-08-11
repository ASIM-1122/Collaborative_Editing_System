
import React, { useContext, useState } from 'react'
import FormInput from '../components/FormInput'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const { register } = useContext(AuthContext)
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function handle(e){
    e.preventDefault()
    try{
      await register(fullname, email, password)
      nav('/dashboard')
    }catch(err){ console.error(err) }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handle} className="card">
        <FormInput label="Full name" value={fullname} onChange={e => setFullname(e.target.value)} />
        <FormInput label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <FormInput label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
        <button className="btn bg-gradient-to-r from-accent to-accent2 text-black" type="submit">Create account</button>
      </form>
    </div>
  )
}