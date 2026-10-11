'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, Check, X } from 'lucide-react'

interface CardProps {
  card: {
    id: string
    title: string
  }
  onUpdateCard?: (cardId: string, newTitle: string) => Promise<void>
  onDeleteCard?: (cardId: string) => Promise<void>
}

export function CardItem({ card, onUpdateCard, onDeleteCard }: CardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(card.title)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: isEditing,
    data: {
      type: 'Card',
      card,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!title.trim() || title === card.title) {
      setTitle(card.title)
      setIsEditing(false)
      return
    }
    const newTitle = title.trim()
    setIsEditing(false)
    if (onUpdateCard) {
      await onUpdateCard(card.id, newTitle)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Supprimer la tâche "${card.title}" ?`)) {
      if (onDeleteCard) {
        await onDeleteCard(card.id)
      }
    }
  }

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="bg-blue-50/50 border-2 border-blue-400 border-dashed rounded-lg p-3 mb-2 opacity-60 min-h-[44px]" 
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? {} : { ...attributes, ...listeners })}
      className={`group bg-white rounded-lg shadow-xs border border-slate-200/80 p-3 mb-2 transition-all text-slate-800 text-sm select-none ${
        isEditing ? 'ring-2 ring-blue-500 shadow-md' : 'cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-300'
      }`}
    >
      {isEditing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-2">
          <textarea
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSave()
              } else if (e.key === 'Escape') {
                setTitle(card.title)
                setIsEditing(false)
              }
            }}
            className="w-full text-sm p-1.5 border border-slate-300 rounded outline-none focus:border-blue-500 resize-none"
            rows={2}
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => {
                setTitle(card.title)
                setIsEditing(false)
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
              title="Annuler"
            >
              <X size={15} />
            </button>
            <button
              type="submit"
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 shadow-xs"
              title="Enregistrer"
            >
              <Check size={14} /> Enregistrer
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start justify-between gap-1.5">
          <p className="break-words leading-snug flex-1">{card.title}</p>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition"
              title="Modifier"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
              title="Supprimer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
