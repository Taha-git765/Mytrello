'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { updateBoard, deleteBoard } from '@/actions/board'

interface BoardCardProps {
  board: {
    id: string
    title: string
  }
}

export function BoardCard({ board }: BoardCardProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(board.title)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!title.trim() || title === board.title) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    await updateBoard(board.id, title.trim())
    setLoading(false)
    setIsEditing(false)
    router.refresh()
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`Êtes-vous sûr de vouloir supprimer le tableau "${board.title}" et tout son contenu ?`)) {
      setLoading(true)
      await deleteBoard(board.id)
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="group relative h-36 rounded-xl p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden">
      {/* Header with Title or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="flex items-center gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm font-bold bg-white text-slate-900 rounded px-2 py-1 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            className="p-1 hover:bg-white/20 rounded text-emerald-300"
            title="Enregistrer"
            disabled={loading}
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setTitle(board.title)
              setIsEditing(false)
            }}
            className="p-1 hover:bg-white/20 rounded text-rose-300"
            title="Annuler"
          >
            <X size={16} />
          </button>
        </form>
      ) : (
        <div className="flex justify-between items-start gap-2">
          <Link href={`/board/${board.id}`} className="flex-1">
            <h2 className="text-base font-bold drop-shadow-sm leading-snug break-words hover:underline">
              {board.title}
            </h2>
          </Link>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsEditing(true)
              }}
              className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition"
              title="Modifier le nom"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-rose-500/80 rounded text-white/80 hover:text-white transition"
              title="Supprimer le tableau"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Footer link */}
      <Link
        href={`/board/${board.id}`}
        className="text-xs text-white/70 group-hover:text-white transition font-medium flex items-center gap-1"
      >
        Ouvrir le tableau →
      </Link>
    </div>
  )
}
