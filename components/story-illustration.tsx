"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/badge"
import { Loader2, RefreshCw } from "lucide-react"

interface StoryIllustrationProps {
  imageUrl: string
  isLoading: boolean
  onRegenerate: () => void
}

export default function StoryIllustration({ imageUrl, isLoading, onRegenerate }: StoryIllustrationProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 h-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">Story Illustration</h3>

        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-700/50">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
            </div>
          ) : imageUrl ? (
            <div className="relative h-full w-full">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Story illustration"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-center">Illustration will appear here</p>
            </div>
          )}
        </div>

        {imageUrl && !isLoading && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full border-gray-600 hover:bg-gray-700"
            onClick={onRegenerate}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Illustration
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

