import React from 'react'
export default function Loader(){
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin border-accent"></div>
    </div>
  )
}