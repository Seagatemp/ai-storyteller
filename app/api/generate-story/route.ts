import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { NextRequest } from "next/server"

export const maxDuration = 60 // Allow up to 60 seconds for story generation

export async function POST(req: NextRequest) {
  const { theme, genre, characters, setting, currentStory, choice } = await req.json()

  // Determine if this is the initial story or a continuation
  const isInitialStory = !currentStory

  // Create a system prompt based on the inputs
  const systemPrompt = `You are a creative storyteller specializing in ${genre || "various genres"} stories.
Create engaging, imaginative stories with vivid descriptions and interesting characters.
Your stories should be appropriate for all ages with no adult or sexual content.
Use descriptive language that would work well with AI image generation.`

  let userPrompt = ""

  if (isInitialStory) {
    // Initial story generation
    userPrompt = `Create the beginning of a ${theme || "adventure"} story in the ${genre || "fantasy"} genre.
Setting: ${setting || "A mysterious forest"}
Main characters: ${characters || "A brave explorer"}

Write approximately 300 words for the beginning of the story. 
At the end, provide exactly THREE possible choices for how the story could continue.
Format the choices as:
[Choice 1]: Brief description of first path
[Choice 2]: Brief description of second path
[Choice 3]: Brief description of third path`
  } else {
    // Continuation based on user choice
    userPrompt = `Continue the following story based on the user's choice:

PREVIOUS STORY:
${currentStory}

USER CHOSE: ${choice}

Continue the story for approximately 300 words based on this choice.
At the end, provide exactly THREE new possible choices for how the story could continue next.
Format the choices as:
[Choice 1]: Brief description of first path
[Choice 2]: Brief description of second path
[Choice 3]: Brief description of third path`
  }

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.8, // Higher temperature for more creativity
  })

  return result.toDataStreamResponse()
}

