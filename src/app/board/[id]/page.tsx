import { getBoardById } from '@/actions/board'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { KanbanBoard } from '@/components/KanbanBoard'
import { BoardHeader } from '@/components/BoardHeader'

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
      {/* Header interactif */}
      <BoardHeader board={{ id: board.id, title: board.title }} />
      
      {/* Kanban Board Container */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <KanbanBoard initialLists={board.lists} boardId={board.id} />
      </main>
    </div>
  )
}
