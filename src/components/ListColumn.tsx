'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CardItem } from './CardItem'

interface ListProps {
  list: {
    id: string
    title: string
    cards: { id: string; title: string; order: number; listId: string }[]
  }
  boardId: string
  onAddCard: (listId: string, title: string) => Promise<void>
}

export function ListColumn({ list, onAddCard }: ListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')

  const { setNodeRef } = useDroppable({
    id: list.id,
    data: {
      type: 'List',
      list,
    },
  })

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const newTitle = title
    setTitle('')
    setIsAdding(false)
    await onAddCard(list.id, newTitle)
  }

  return (
    <div 
      ref={setNodeRef}
      className="bg-gray-200/90 backdrop-blur-md rounded-xl w-72 shrink-0 p-3 max-h-[calc(100vh-100px)] flex flex-col shadow-md border border-white/20"
    >
      <div className="flex justify-between items-center px-1 mb-2">
        <h3 className="font-bold text-slate-800 text-sm tracking-wide">{list.title}</h3>
        <span className="text-xs text-slate-500 font-medium bg-slate-300/50 px-2 py-0.5 rounded-full">
          {list.cards.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[40px] pr-1">
        <SortableContext items={list.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {isAdding ? (
        <form onSubmit={handleAddCard} className="mt-2 pt-2 border-t border-gray-300/60">
          <textarea
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la tâche..."
            className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
            >
              Ajouter la tâche
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="hover:bg-gray-300/80 text-slate-600 px-3 py-1.5 rounded-lg text-sm transition font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="text-left text-slate-600 hover:text-slate-900 hover:bg-black/5 p-2 rounded-lg text-sm mt-1 transition font-medium flex items-center gap-1.5 w-full"
        >
          <span className="text-lg leading-none">+</span> Ajouter une tâche
        </button>
      )}
    </div>
  )
}
