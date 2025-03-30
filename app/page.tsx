"use client"

import { useState, useEffect } from "react"
import { useCompletion } from "@ai-sdk/react"
import { Button } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import StoryDisplay from "@/components/story-display"
import StoryChoices from "@/components/story-choices"
import StoryIllustration from "@/components/story-illustration"
import { Loader2 } from "lucide-react"

export default function StorytellerPage() {
  // Story parameters
  const [theme, setTheme] = useState("adventure")
  const [genre, setGenre] = useState("fantasy")
  const [characters, setCharacters] = useState("")
  const [setting, setSetting] = useState("")

  // Story state
  const [currentStory, setCurrentStory] = useState("")
  const [storyHistory, setStoryHistory] = useState<string[]>([])
  const [choices, setChoices] = useState<string[]>([])
  const [selectedChoice, setSelectedChoice] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [activeTab, setActiveTab] = useState("create")

  // AI completion hook
  const { completion, input, setInput, handleSubmit, isLoading, error, setCompletion } = useCompletion({
    api: "/api/generate-story",
    body: {
      theme,
      genre,
      characters,
      setting,
      currentStory,
      choice: selectedChoice,
    },
    onResponse: () => {
      // Clear previous choices when a new response starts
      setChoices([])
    },
    onFinish: () => {
      // Extract choices from the completion
      extractChoicesFromStory()
    },
  })

  // Genres for selection
  const genres = [
    "fantasy",
    "science fiction",
    "mystery",
    "adventure",
    "fairy tale",
    "historical",
    "superhero",
    "mythology",
  ]

  // Themes for selection
  const themes = ["adventure", "discovery", "friendship", "courage", "mystery", "magic", "journey", "transformation"]

  // Extract choices from the story text
  const extractChoicesFromStory = () => {
    if (!completion) return

    const choiceRegex = /\[Choice \d+\]: (.*?)(?=\n|$)/g
    const extractedChoices: string[] = []
    let match

    while ((match = choiceRegex.exec(completion)) !== null) {
      extractedChoices.push(match[1])
    }

    setChoices(extractedChoices)

    // Generate an image prompt from the story (excluding the choices)
    const storyWithoutChoices = completion.split("[Choice 1]")[0].trim()
    setImagePrompt(storyWithoutChoices.substring(0, 200))
  }

  // Generate an illustration for the story
  const generateIllustration = async () => {
    if (!imagePrompt) return

    setIsGeneratingImage(true)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      })

      const data = await response.json()

      if (data.imageUrl) {
        setImageUrl(data.imageUrl)
      }
    } catch (error) {
      console.error("Error generating illustration:", error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Continue the story based on a choice
  const continueStory = (choice: string) => {
    // Save current story to history
    setStoryHistory([...storyHistory, completion])

    // Set the selected choice
    setSelectedChoice(choice)

    // Update current story
    setCurrentStory(completion)

    // Clear completion to show loading state
    setCompletion("")

    // Submit the continuation request
    handleSubmit(new Event("submit"))
  }

  // Start a new story
  const startNewStory = () => {
    setCurrentStory("")
    setStoryHistory([])
    setChoices([])
    setSelectedChoice("")
    setImageUrl("")
    setCompletion("")
    setActiveTab("create")
  }

  // Generate illustration when we have a new story
  useEffect(() => {
    if (imagePrompt && !imageUrl && !isGeneratingImage) {
      generateIllustration()
    }
  }, [imagePrompt])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600">
            AI Storyteller
          </h1>
          <p className="text-xl text-gray-300">Interactive stories generated with artificial intelligence</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Create Story</TabsTrigger>
            <TabsTrigger value="read" disabled={!completion}>
              Read Story
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit(e)
                    setActiveTab("read")
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="theme" className="block text-lg font-medium mb-2">
                        Theme
                      </label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {themes.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="genre" className="block text-lg font-medium mb-2">
                        Genre
                      </label>
                      <Select value={genre} onValueChange={setGenre}>
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {genres.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="characters" className="block text-lg font-medium mb-2">
                      Main Characters
                    </label>
                    <Input
                      id="characters"
                      value={characters}
                      onChange={(e) => setCharacters(e.target.value)}
                      placeholder="Describe the main characters (e.g., 'A curious young wizard and his loyal phoenix')"
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="setting" className="block text-lg font-medium mb-2">
                      Setting
                    </label>
                    <Textarea
                      id="setting"
                      value={setting}
                      onChange={(e) => setSetting(e.target.value)}
                      placeholder="Describe the story setting (e.g., 'An ancient floating city above the clouds')"
                      className="bg-gray-700 border-gray-600 h-24"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Story...
                      </>
                    ) : (
                      "Generate Story"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="read" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <StoryDisplay story={completion} isLoading={isLoading} storyHistory={storyHistory} />

                {!isLoading && choices.length > 0 && (
                  <StoryChoices choices={choices} onChoiceSelected={continueStory} />
                )}

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={startNewStory} className="border-gray-600 hover:bg-gray-700">
                    Start New Story
                  </Button>

                  {storyHistory.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Go back to previous part of the story
                        const newHistory = [...storyHistory]
                        const previousStory = newHistory.pop()
                        setStoryHistory(newHistory)
                        setCurrentStory(newHistory.length > 0 ? newHistory[newHistory.length - 1] : "")
                        setCompletion(previousStory || "")
                        // Extract choices again
                        setTimeout(extractChoicesFromStory, 0)
                      }}
                      className="border-gray-600 hover:bg-gray-700"
                    >
                      Go Back
                    </Button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <StoryIllustration
                  imageUrl={imageUrl}
                  isLoading={isGeneratingImage}
                  onRegenerate={generateIllustration}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

