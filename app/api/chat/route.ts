import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Create a custom AI provider instance for OpenRouter
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:3000",
    "X-Title": "Spark AI Chat",
  },
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openrouter("meta-llama/llama-3.1-8b-instruct:free"),
      messages,
      system: `You are Spark, a helpful and friendly AI assistant. You're knowledgeable, creative, and always eager to help users with their questions and tasks. Keep your responses engaging and conversational while being informative and accurate.`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    return new Response("Internal Server Error", { status: 500 })
  }
}
