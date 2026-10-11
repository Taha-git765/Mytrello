'use server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createList(boardId: string, title: string) {
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

export async function updateList(id: string, boardId: string, title: string) {
  const list = await db.list.update({
    where: { id },
    data: { title }
  })
  revalidatePath(`/board/${boardId}`)
  return list
}

export async function deleteList(id: string, boardId: string) {
  await db.list.delete({
    where: { id }
  })
  revalidatePath(`/board/${boardId}`)
}
