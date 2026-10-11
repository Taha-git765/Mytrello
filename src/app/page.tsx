import { getBoards, createBoard } from '@/actions/board'
import { BoardCard } from '@/components/BoardCard'

export const instant = false;

export default async function Home() {
  const boards = await getBoards()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold p-1.5 rounded-md flex items-center justify-center w-7 h-7 text-sm">
            T
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">MyTrello</span>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
          Mode Local & Neon DB
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-10 px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Mes Espaces de Travail</h1>
            <p className="text-sm text-slate-500 mt-1">Gérez vos applications, jeux et projets au même endroit.</p>
          </div>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}

          {/* Form to Create a Board */}
          <form
            action={async (formData) => {
              'use server'
              const title = formData.get('title') as string
              if (title) await createBoard(title)
            }}
            className="h-36 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 flex flex-col justify-between bg-white hover:bg-blue-50/20 transition group"
          >
            <input
              type="text"
              name="title"
              placeholder="Nom du projet..."
              className="w-full text-sm font-medium bg-transparent outline-none placeholder:text-slate-400 text-slate-800 border-b border-transparent focus:border-blue-400 pb-1"
              required
            />
            <button
              type="submit"
              className="w-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-xs font-semibold py-2 rounded-lg transition"
            >
              + Créer un tableau
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
