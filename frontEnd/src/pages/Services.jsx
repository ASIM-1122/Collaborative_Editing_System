
import React, { useEffect, useState } from 'react'
import api from '../utils/documentsApi'
import ServiceCard from '../components/ServiceCard'
import Loader from '../components/Loader'

export default function Services(){
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)

  async function load(){
    try{
      setLoading(true)
      const res = await api.get('/document/fetchAllDocuments')
      console.log(res.data)
      setDocs(res.data.documents || [])
    }catch(err){
      console.error(err)
    }finally{ setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Documents</h2>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {docs.map(d => <ServiceCard key={d._id} doc={d} />)}
          </div>
        )}
      </div>
    </div>
  )
}