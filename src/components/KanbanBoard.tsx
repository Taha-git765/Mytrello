'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { ListColumn } from './ListColumn'
import { createList } from '@/actions/list'
import { createCard, updateCardsOrder } from '@/actions/card'

interface KanbanBoardProps {
  initialLists: any[]
  boardId: string
}

export function KanbanBoard({ initialLists = [], boardId }: KanbanBoardProps) {
  const [lists, setLists] = useState(initialLists)
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')

  // Synchroniser le state local quand les données serveur changent
  useEffect(() => {
    setLists(initialLists)
  }, [initialLists])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findListContainingCard = (cardId: string) => {
    return lists.find((list) => list.cards.some((c: any) => c.id === cardId))
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const activeList = findListContainingCard(activeId)
    const overList = findListContainingCard(overId) || lists.find((l) => l.id === overId)

    if (!activeList || !overList || activeList === overList) return

    setLists((prev) => {
      const activeCards = activeList.cards
      const overCards = overList.cards

      const activeIndex = activeCards.findIndex((c: any) => c.id === activeId)
      const overIndex = overCards.findIndex((c: any) => c.id === overId)

      const activeCard = activeCards[activeIndex]
      const newActiveCards = activeCards.filter((c: any) => c.id !== activeId)

      const newOverCards = [...overCards]
      if (overIndex >= 0) {
        newOverCards.splice(overIndex, 0, { ...activeCard, listId: overList.id })
      } else {
        newOverCards.push({ ...activeCard, listId: overList.id })
      }

      return prev.map((l) => {
        if (l.id === activeList.id) return { ...l, cards: newActiveCards }
        if (l.id === overList.id) return { ...l, cards: newOverCards }
        return l
      })
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const activeList = findListContainingCard(activeId)
    const overList = findListContainingCard(overId) || lists.find((l) => l.id === overId)

    if (!activeList || !overList) return

    if (activeList.id === overList.id) {
      const activeIndex = activeList.cards.findIndex((c: any) => c.id === activeId)
      const overIndex = activeList.cards.findIndex((c: any) => c.id === overId)

      if (activeIndex !== overIndex) {
        const newCards = arrayMove(activeList.cards, activeIndex, overIndex)
        setLists((prev) =>
          prev.map((l) => (l.id === activeList.id ? { ...l, cards: newCards } : l))
        )

        const updates = newCards.map((c: any, index: number) => ({
          id: c.id,
          listId: activeList.id,
          order: index,
        }))
        await updateCardsOrder(updates, boardId)
      }
    } else {
      const updates = overList.cards.map((c: any, index: number) => ({
        id: c.id,
        listId: overList.id,
        order: index,
      }))
      await updateCardsOrder(updates, boardId)
    }
  }

  // Création optimiste d'une liste
  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListTitle.trim()) return

    const title = newListTitle
    setNewListTitle('')
    setIsAddingList(false)

    // Ajout optimiste
    const tempId = `temp-${Date.now()}`
    setLists((prev) => [...prev, { id: tempId, title, cards: [] }])

    await createList(boardId, title)
  }

  // Création optimiste d'une carte
  const handleAddCard = async (listId: string, cardTitle: string) => {
    const tempId = `temp-${Date.now()}`
    setLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          return {
            ...l,
            cards: [...l.cards, { id: tempId, title: cardTitle, listId, order: l.cards.length }],
          }
        }
        return l
      })
    )

    await createCard(listId, boardId, cardTitle)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 items-start h-full">
        {lists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            boardId={boardId}
            onAddCard={handleAddCard}
          />
        ))}

        {isAddingList ? (
          <div className="bg-gray-200/80 rounded-lg w-72 shrink-0 p-3 shadow-sm">
            <form onSubmit={handleAddList}>
              <input
                autoFocus
                type="text"
                placeholder="Titre de la liste..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="w-full p-2 border rounded text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  Ajouter la liste
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingList(false)}
                  className="hover:bg-gray-300 text-slate-600 px-3 py-1.5 rounded text-sm transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingList(true)}
            className="bg-white/20 hover:bg-white/30 text-white rounded-lg w-72 shrink-0 p-3 text-sm font-medium text-left transition flex items-center gap-2"
          >
            <span>+</span> Ajouter une autre liste
          </button>
        )}
      </div>
    </DndContext>
  )
}
