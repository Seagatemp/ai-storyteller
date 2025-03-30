"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/badge"

interface StoryChoicesProps {
  choices: string[]
  onChoiceSelected: (choice: string) => void
}

export default function StoryChoices({ choices, onChoiceSelected }: StoryChoicesProps) {
  if (!choices || choices.length === 0) return null

  return (
    <Card className="mt-6 bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">What happens next?</h3>
        <div className="space-y-3">
          {choices.map((choice, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4 border-gray-600 hover:bg-gray-700 hover:text-cyan-300 transition-colors"
              onClick={() => onChoiceSelected(choice)}
            >
              <span className="mr-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm">
                {index + 1}
              </span>
              {choice}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

