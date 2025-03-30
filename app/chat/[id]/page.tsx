import { loadChat } from "@/lib/chat-store"
import ChatComponent from "@/components/chat"

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params
  const messages = await loadChat(id)

  return <ChatComponent id={id} initialMessages={messages} />
}

