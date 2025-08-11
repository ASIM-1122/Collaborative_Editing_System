import React from 'react'
import { Link } from 'react-router-dom'
export default function ServiceCard({ doc }){
  return (
    <div className="card p-4 w-full md:w-1/3">
      <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
      <p className="text-sm text-slate-300 line-clamp-3">{doc.content?.slice(0,120) || 'No content yet'}</p>
      <div className="mt-4 flex justify-between items-center">
        <Link to={`/services/${doc._id}`} className="text-sm">Open</Link>
        <div className="text-xs text-slate-400">Updated {new Date(doc.updatedAt).toLocaleString()}</div>
      </div>
    </div>
  )
}