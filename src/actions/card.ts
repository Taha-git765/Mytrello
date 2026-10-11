'use server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createCard(listId: string, boardId: string, title: string) {
  const lastCard = await db.card.findFirst({
    where: { listId },
    orderBy: { order: 'desc' }
  })
  const newOrder = lastCard ? lastCard.order + 1 : 1

  const card = await db.card.create({
    data: {
      title,
      listId,
      order: newOrder
    }
  })
  
  revalidatePath(`/board/${boardId}`)
  return card
}

export async function updateCard(id: string, boardId: string, title: string) {
  const card = await db.card.update({
    where: { id },
    data: { title }
  })
  revalidatePath(`/board/${boardId}`)
  return card
}

export async function deleteCard(id: string, boardId: string) {
  await db.card.delete({
    where: { id }
  })
  revalidatePath(`/board/${boardId}`)
}

export async function updateCardsOrder(items: { id: string, listId: string, order: number }[], boardId: string) {
  const queries = items.map((item) =>
    db.card.update({
      where: { id: item.id },
      data: {
        listId: item.listId,
        order: item.order
      }
    })
  )
  
  await db.$transaction(queries)
  revalidatePath(`/board/${boardId}`)
}
