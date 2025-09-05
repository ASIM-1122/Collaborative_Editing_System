import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllDocuments } from '../redux/documentSlice' // Correct thunk import
import ServiceCard from '../components/ServiceCard'
import Loader from '../components/Loader'

export default function Services() {
  const dispatch = useDispatch()

  // Select documents list and loading state from Redux
  const { list: docs, loading } = useSelector(state => state.documents)

  useEffect(() => {
    dispatch(fetchAllDocuments()) // Use fetchAllDocuments thunk
  }, [dispatch])

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Documents</h2>
        {loading ? (
  <Loader />
) : Array.isArray(docs) && docs.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {docs.map(d => (
      <ServiceCard key={d._id} doc={d} />
    ))}
  </div>
) : (
  <p>No documents found.</p>
)}

      </div>
    </div>
  )
}
