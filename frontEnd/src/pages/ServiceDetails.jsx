
import React, { useEffect, useRef, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/documentsApi'
import Loader from '../components/Loader'
import { io } from 'socket.io-client'
import { AuthContext } from '../context/AuthContext'

export default function ServiceDetails(){
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const socketRef = useRef(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    async function load(){
      const res = await api.get(`/fetchDocumentById/${id}`)
      setDoc(res.data.documents[0] || null)
      setContent(res.data.content || '')
    }
    load()
  }, [id])

  useEffect(() => {
    // connect socket
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000', { transports: ['websocket'] })
    socketRef.current.emit('join-document', id)

    socketRef.current.on('receive-changes', ({ content: remote }) => {
      // naive merge: replace content if different
      if (remote !== content) setContent(remote)
    })

    socketRef.current.on('document-saved', ({ content: remote }) => {
      setContent(remote)
      // show small saved indicator
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [id])

  // autosave debounce
  useEffect(() => {
    const t = setTimeout(() => handleSave(false), 3000)
    return () => clearTimeout(t)
  }, [content])

  function handleLocalEdit(e){
    const v = e.target.value
    setContent(v)
    socketRef.current?.emit('send-changes', { documentId: id, content: v })
  }

  async function handleSave(showToast = true){
    try{
      setSaving(true)
      const res = await api.put(`/document/updateDocument/${id}`, { content, author: user?.id || user?.email })
      setDoc(res.data)
      socketRef.current?.emit('save-document', { documentId: id, content })
      if (showToast) {}
    }catch(err){ console.error(err) }finally{ setSaving(false) }
  }

  async function loadVersions(){
    try{
      const res = await api.get(`/version/${id}`)
      return res.data
    }catch(err){ console.error(err); return [] }
  }

  const [versions, setVersions] = useState([])
  async function showVersions(){
    const v = await loadVersions()
    setVersions(v)
  }

  async function handleRevert(versionId){
    try{
      await api.post(`/version/revert/${id}/${versionId}`, { author: user?.id || user?.email })
      const ref = await api.get(`/document/${id}`)
      setContent(ref.data.content)
      showVersions()
    }catch(err){ console.error(err) }
  }

  if (!doc) return <Loader />

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{doc.title}</h2>
        <div className="text-sm text-slate-400">{saving ? 'Saving...' : 'Saved'}</div>
      </div>

      <textarea value={content} onChange={handleLocalEdit} className="w-full h-96 p-4 rounded-lg bg-white/5 border border-white/6" />
      <div className="mt-4 flex gap-3">
        <button onClick={() => handleSave(true)} className="btn bg-gradient-to-r from-accent to-accent2 text-black">Save</button>
        <button onClick={showVersions} className="btn bg-white/5">Show Versions</button>
      </div>

      {versions.length > 0 && (
        <div className="mt-6 card">
          <h3 className="font-semibold mb-2">Version History</h3>
          <div className="flex flex-col gap-3">
            {versions.map(v => (
              <div key={v._id} className="p-3 border rounded bg-white/3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-300">{new Date(v.createdAt).toLocaleString()}</div>
                    <div className="text-sm">{v.content.slice(0,120)}</div>
                  </div>
                  <div>
                    <button onClick={() => handleRevert(v._id)} className="btn bg-white/5">Revert</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}