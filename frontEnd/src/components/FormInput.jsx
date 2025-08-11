import React from 'react'
export default function FormInput({ label, ...props }){
  return (
    <label className="block text-left mb-3">
      <div className="text-sm mb-1 text-slate-300">{label}</div>
      <input className="w-full p-3 rounded-lg bg-white/5 border border-white/6" {...props} />
    </label>
  )
}