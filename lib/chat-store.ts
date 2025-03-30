import type { Message } from "ai"
import { kv } from "@vercel/kv"
import { generateId } from "ai"

export async function createChat(): Promise<string> {
  const id = generateId()
  await kv.set(`chat:${id}`, JSON.stringify([]))
  return id
}

export async function loadChat(id: string): Promise<Message[]> {
  const data = await kv.get(`chat:${id}`)
  return data ? JSON.parse(data as string) : []
}

export async function saveChat({
  id,
  messages,
}: {
  id: string
  messages: Message[]
}): Promise<void> {
  await kv.set(`chat:${id}`, JSON.stringify(messages))
}

