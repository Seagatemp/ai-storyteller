import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    // Create an enhanced prompt for better image generation
    const enhancedPrompt = `Create a detailed illustration for a story scene: ${prompt}. 
    The style should be vibrant, colorful, and suitable for all ages. 
    Make it look like a professional storybook illustration.`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
    })

    return NextResponse.json({ imageUrl: response.data[0].url })
  } catch (error: any) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 })
  }
}

