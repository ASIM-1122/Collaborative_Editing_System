
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../utils/documentsApi'
import ServiceCard from '../components/ServiceCard'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const { user } = useContext(AuthContext)
  const [docs, setDocs] = useState([])
  const nav = useNavigate()

  useEffect(() => { load() }, [])

  async function load(){
    try{
      const res = await api.get('/document/create')
      // filter by owner or collaborators
      const mine = res.data.filter(d => d.owner === (user?.id || user?._id))
      setDocs(mine)
    }catch(err){ console.error(err) }
  }

  async function createNew(){
    const title = 'Untitled'
    const res = await api.post('/document/create', { title, content: '', owner: user?.id || user?._id })
    nav(`/services/${res.data._id}`)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button onClick={createNew} className="btn bg-gradient-to-r from-accent to-accent2 text-black">New Document</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {docs.map(d => <ServiceCard key={d._id} doc={d} />)}
      </div>
    </div>
  )
}