
import React, { useContext, useState } from 'react'
import FormInput from '../components/FormInput'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const  {login}  = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function handle(e){
    e.preventDefault()
    try{
      await login(email, password)
      nav('/dashboard')
    }catch(err){ console.error(err) }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handle} className="card">
        <FormInput label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <FormInput label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
        <button className="btn bg-gradient-to-r from-accent to-accent2 text-black" type="submit">Login</button>
      </form>
    </div>
  )
}