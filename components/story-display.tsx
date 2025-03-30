import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface StoryDisplayProps {
  story: string
  isLoading: boolean
  storyHistory: string[]
}

export default function StoryDisplay({ story, isLoading, storyHistory }: StoryDisplayProps) {
  // Function to format story text (removing the choice section)
  const formatStoryText = (text: string) => {
    if (!text) return ""

    // Remove the choices section
    const storyWithoutChoices = text.split("[Choice 1]")[0].trim()

    // Split into paragraphs
    return storyWithoutChoices.split("\n").filter((p) => p.trim())
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mb-4" />
            <p className="text-gray-300 text-lg">Crafting your story...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!story && storyHistory.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Your story will appear here...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const paragraphs = formatStoryText(story)

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="prose prose-invert max-w-none">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="mb-4 text-gray-200 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

