'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getBoards() {
  return await db.board.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function createBoard(title: string) {
  const board = await db.board.create({
    data: { title }
  })
  revalidatePath('/')
  return board
}

export async function updateBoard(id: string, title: string) {
  const board = await db.board.update({
    where: { id },
    data: { title }
  })
  revalidatePath('/')
  revalidatePath(`/board/${id}`)
  return board
}

export async function deleteBoard(id: string) {
  await db.board.delete({
    where: { id }
  })
  revalidatePath('/')
}

export async function getBoardById(id: string) {
  return await db.board.findUnique({
    where: { id },
    include: {
      lists: {
        orderBy: { order: 'asc' },
        include: {
          cards: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  })
}
