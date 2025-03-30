"use client"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Message } from "ai"

export default function ChatComponent({
  id,
  initialMessages,
}: {
  id?: string
  initialMessages?: Message[]
}) {
  const { messages, input, handleInputChange, handleSubmit, status, error, reload } = useChat({
    id,
    initialMessages,
    sendExtraMessageFields: true,
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">AI Chatbot</CardTitle>
        </CardHeader>

        <CardContent className="h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {status === "streaming" && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                An error occurred. Please try again.
                <Button variant="outline" size="sm" onClick={reload} className="ml-2">
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={status === "streaming"}
            />
            <Button type="submit" disabled={status === "streaming" || !input.trim()}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

