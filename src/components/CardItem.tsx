'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface CardProps {
  card: {
    id: string
    title: string
  }
}

export function CardItem({ card }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
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
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm border border-slate-200/60 p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-300 transition-all text-slate-800 text-sm font-normal select-none"
    >
      <p className="break-words leading-snug">{card.title}</p>
    </div>
  )
}
