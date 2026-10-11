'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { updateBoard, deleteBoard } from '@/actions/board'

interface BoardHeaderProps {
  board: {
    id: string
    title: string
  }
}

export function BoardHeader({ board }: BoardHeaderProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(board.title)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
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

  const handleDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le tableau "${board.title}" et toutes ses listes ?`)) {
      setLoading(true)
      await deleteBoard(board.id)
      router.push('/')
    }
  }

  return (
    <header className="h-14 px-6 bg-black/25 backdrop-blur-md text-white flex items-center justify-between border-b border-white/10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />

        {isEditing ? (
          <form onSubmit={handleUpdate} className="flex items-center gap-1.5">
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold bg-white text-slate-900 rounded px-2.5 py-0.5 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              className="p-1 hover:bg-white/20 rounded text-emerald-300"
              title="Valider"
              disabled={loading}
            >
              <Check size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle(board.title)
                setIsEditing(false)
              }}
              className="p-1 hover:bg-white/20 rounded text-rose-300"
              title="Annuler"
            >
              <X size={18} />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 group">
            <h1 
              onClick={() => setIsEditing(true)} 
              className="text-lg font-bold tracking-wide drop-shadow-sm cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded transition"
              title="Cliquer pour modifier le nom"
            >
              {title}
            </h1>
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded text-white/80 transition"
              title="Modifier le nom"
            >
              <Pencil size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          className="bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-all font-medium border border-rose-400/20 flex items-center gap-1.5"
          title="Supprimer ce tableau"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Supprimer</span>
        </button>

        <Link
          href="/"
          className="bg-white/15 hover:bg-white/25 active:bg-white/30 text-white px-3.5 py-1.5 rounded-lg text-sm transition-all font-medium border border-white/10 shadow-sm flex items-center gap-1.5"
        >
          <span>←</span> Mes Tableaux
        </Link>
      </div>
    </header>
  )
}
