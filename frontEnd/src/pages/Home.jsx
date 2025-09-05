import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Home() {
  const user = useSelector(state => state.user)
  const documentsCount = useSelector(state => state.documents?.items?.length || 0)

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-5xl mx-auto text-center py-16">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent2"
        >
          CollabEdit — Realtime Document Collaboration
        </motion.h1>

        <p className="mt-4 text-slate-300">
          {user?.name
            ? `Welcome back, ${user.name}! You have ${documentsCount} documents.`
            : 'Create documents, invite collaborators, edit together in realtime and view version history.'}
        </p>

        <Link
          to="/services"
          className="mt-6 inline-block btn bg-gradient-to-r from-accent to-accent2 text-black"
        >
          View Documents
        </Link>
      </div>
    </div>
  )
}
