import { openai } from "@ai-sdk/openai"
import { appendResponseMessages, streamText } from "ai"
import { saveChat } from "@/lib/chat-store"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, id } = await req.json()

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    messages,
    async onFinish({ response }) {
      if (id) {
        await saveChat({
          id,
          messages: appendResponseMessages({
            messages,
            responseMessages: response.messages,
          }),
        })
      }
    },
  })

  return result.toDataStreamResponse()
}

