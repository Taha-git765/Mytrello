'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { CardItem } from './CardItem'

interface ListProps {
  list: {
    id: string
    title: string
    cards: { id: string; title: string; order: number; listId: string }[]
  }
  boardId: string
  onAddCard: (listId: string, title: string) => Promise<void>
  onUpdateList: (listId: string, newTitle: string) => Promise<void>
  onDeleteList: (listId: string) => Promise<void>
  onUpdateCard: (listId: string, cardId: string, newTitle: string) => Promise<void>
  onDeleteCard: (listId: string, cardId: string) => Promise<void>
}

export function ListColumn({
  list,
  onAddCard,
  onUpdateList,
  onDeleteList,
  onUpdateCard,
  onDeleteCard,
}: ListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [cardTitle, setCardTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [listTitle, setListTitle] = useState(list.title)

  const { setNodeRef } = useDroppable({
    id: list.id,
    data: {
      type: 'List',
      list,
    },
  })

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardTitle.trim()) return
    const newTitle = cardTitle
    setCardTitle('')
    setIsAdding(false)
    await onAddCard(list.id, newTitle)
  }

  const handleSaveTitle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!listTitle.trim() || listTitle === list.title) {
      setListTitle(list.title)
      setIsEditingTitle(false)
      return
    }
    const newTitle = listTitle.trim()
    setIsEditingTitle(false)
    await onUpdateList(list.id, newTitle)
  }

  const handleDeleteList = async () => {
    if (confirm(`Supprimer la colonne "${list.title}" et ses ${list.cards.length} tâche(s) ?`)) {
      await onDeleteList(list.id)
    }
  }

  return (
    <div 
      ref={setNodeRef}
      className="bg-gray-200/90 backdrop-blur-md rounded-xl w-72 shrink-0 p-3 max-h-[calc(100vh-100px)] flex flex-col shadow-md border border-white/20"
    >
      {/* List Header */}
      <div className="flex justify-between items-center px-1 mb-2 group">
        {isEditingTitle ? (
          <form onSubmit={handleSaveTitle} className="flex items-center gap-1 flex-1 mr-1">
            <input
              autoFocus
              type="text"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setListTitle(list.title)
                  setIsEditingTitle(false)
                }
              }}
              className="w-full text-sm font-bold bg-white text-slate-800 rounded px-1.5 py-0.5 outline-none border border-blue-400"
            />
            <button
              type="submit"
              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
              title="Valider"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                setListTitle(list.title)
                setIsEditingTitle(false)
              }}
              className="p-1 text-slate-500 hover:bg-slate-300 rounded"
              title="Annuler"
            >
              <X size={14} />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="font-bold text-slate-800 text-sm tracking-wide truncate cursor-pointer hover:bg-black/5 px-1 py-0.5 rounded transition"
              title="Cliquer pour modifier le titre"
            >
              {list.title}
            </h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-300/60 px-2 py-0.5 rounded-full shrink-0">
              {list.cards.length}
            </span>
          </div>
        )}

        {!isEditingTitle && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setIsEditingTitle(true)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-300/60 rounded transition"
              title="Modifier le nom de la liste"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDeleteList}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-100/60 rounded transition"
              title="Supprimer la liste"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Cards container */}
      <div className="flex-1 overflow-y-auto min-h-[40px] pr-1">
        <SortableContext items={list.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onUpdateCard={(cardId, newTitle) => onUpdateCard(list.id, cardId, newTitle)}
              onDeleteCard={(cardId) => onDeleteCard(list.id, cardId)}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add card button or form */}
      {isAdding ? (
        <form onSubmit={handleAddCard} className="mt-2 pt-2 border-t border-gray-300/60">
          <textarea
            autoFocus
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="Titre de la tâche..."
            className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-xs"
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-xs"
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
