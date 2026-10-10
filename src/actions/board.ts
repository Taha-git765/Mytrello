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
