"use client"

import { useState, type KeyboardEvent } from "react"
import { ArrowUp, Sparkles, MessageSquareText } from "lucide-react"

/** Inline SVG loading spinner — no external primitive needed. */
function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

interface AIChatBlockProps {
  /** Main page heading shown above the card. */
  heading?: string
  /** Supporting copy shown under the heading. */
  subheading?: string
  /** Title shown in the card header. */
  cardTitle?: string
  /** Description shown in the card header. */
  cardDescription?: string
  /** Placeholder text for the prompt input. */
  placeholder?: string
  /** Endpoint the prompt is POSTed to. Falls back to the NEXT_PUBLIC_RENDER_API_URL env var. */
  apiUrl?: string
  /** Extra classes appended to the outer section wrapper. */
  className?: string
}

export function AIChatBlock({
  heading = "AI Chat with Your Source",
  subheading = "A minimalist assistant that answers questions grounded in your context.",
  cardTitle = "Ask your source",
  cardDescription = "Query the AI about your provided context.",
  placeholder = "Ask the AI something about the context",
  apiUrl,
  className = "",
}: AIChatBlockProps) {
  const [prompt, setPrompt] = useState("")
  const [llmResponse, setLlmResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function communicateWithBackend() {
    const payload = { user_question: prompt }
    const baseUrl = apiUrl ?? process.env.NEXT_PUBLIC_RENDER_API_URL

    //fetch code
    const response = await fetch(`${baseUrl}/prompt`, {
      method: "POST",
      headers: { "Content-type": "application/json" }, //mandatory metadata to get Pydantic to read the JSON properly
      body: JSON.stringify(payload), //turn the variable into a string and transmit safely as JSON
    })

    const reply = await response.json()
    setLlmResponse(reply.answer)
    //this thing unpack the JSON the backen returns
  }

  async function handleSubmit() {
    if (!prompt.trim() || isLoading) return
    setIsLoading(true)
    try {
      await communicateWithBackend()
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // Guard against submitting mid-composition for CJK IMEs.
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section
      className={`flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-background px-4 py-12 ${className}`}
    >
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">{heading}</h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">{subheading}</p>
      </header>

      {/* Card */}
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        {/* Card header */}
        <div className="flex flex-row items-center gap-3 p-6">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="font-semibold leading-none text-balance">{cardTitle}</h2>
            <p className="text-sm text-muted-foreground">{cardDescription}</p>
          </div>
        </div>

        {/* Card content */}
        <div className="flex flex-col gap-4 p-6 pt-0">
          {/* Response area */}
          <div className="min-h-40 rounded-lg border border-border bg-muted/40 p-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Thinking&hellip;
              </div>
            ) : llmResponse ? (
              <p className="text-sm leading-relaxed text-foreground text-pretty whitespace-pre-wrap">{llmResponse}</p>
            ) : (
              <div className="flex h-full min-h-32 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <MessageSquareText className="size-6" aria-hidden="true" />
                <p className="text-sm text-balance">Your AI answer will appear here.</p>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1.5 focus-within:ring-2 focus-within:ring-ring">
            <input
              type="text"
              placeholder={placeholder}
              value={prompt}
              disabled={isLoading}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Prompt"
              className="flex-1 bg-transparent px-2.5 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isLoading || !prompt.trim()}
              onClick={handleSubmit}
              aria-label="Send prompt to AI"
              className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? <Spinner className="size-4" /> : <ArrowUp className="size-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
