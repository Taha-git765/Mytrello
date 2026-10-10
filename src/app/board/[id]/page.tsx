import { getBoardById } from '@/actions/board'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { connection } from 'next/server'
import { KanbanBoard } from '@/components/KanbanBoard'

export const instant = false;

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const board = await getBoardById(id)
  
  if (!board) {
    return notFound()
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-700 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 px-6 bg-black/20 backdrop-blur-md text-white flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="text-lg font-bold tracking-wide drop-shadow-sm">{board.title}</h1>
        </div>
        <Link 
          href="/" 
          className="bg-white/15 hover:bg-white/25 active:bg-white/30 text-white px-3.5 py-1.5 rounded-lg text-sm transition-all font-medium border border-white/10 shadow-sm flex items-center gap-1.5"
        >
          <span>←</span> Mes Tableaux
        </Link>
      </header>
      
      {/* Kanban Board Container */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <KanbanBoard initialLists={board.lists} boardId={board.id} />
      </main>
    </div>
  )
}
