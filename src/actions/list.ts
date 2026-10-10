'use server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createList(boardId: string, title: string) {
  // Trouver l'ordre le plus élevé pour placer la nouvelle liste à la fin
  const lastList = await db.list.findFirst({
    where: { boardId },
    orderBy: { order: 'desc' }
  })
  const newOrder = lastList ? lastList.order + 1 : 1

  const list = await db.list.create({
    data: {
      title,
      boardId,
      order: newOrder
    }
  })
  
  revalidatePath(`/board/${boardId}`)
  return list
}
