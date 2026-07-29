"use client"

import { useState, type KeyboardEvent } from "react"
import { ArrowUp, Sparkles, MessageSquareText, Bot } from "lucide-react"

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
      className={`relative flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-background overflow-hidden px-4 py-12 ${className}`}
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <header className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          <span>Next-Gen Intelligence</span>
        </div>
        <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl text-balance">
          {heading}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          {subheading}
        </p>
      </header>

      {/* Card */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-card/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] dark:border-white/5 dark:bg-black/40">
        
        {/* Card header */}
        <div className="flex flex-row items-center gap-4 border-b border-border/50 p-6 md:p-8">
          <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30">
            <Bot className="size-6" aria-hidden="true" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity hover:opacity-100" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{cardTitle}</h2>
            <p className="text-sm text-muted-foreground">{cardDescription}</p>
          </div>
        </div>

        {/* Card content */}
        <div className="flex flex-col gap-6 p-6 md:p-8">
          
          {/* Response area */}
          <div className="relative min-h-[200px] rounded-2xl border border-border/50 bg-background/50 p-6 shadow-inner backdrop-blur-sm transition-all duration-300">
            {isLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground animate-pulse">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Spinner className="size-5" />
                </div>
                <span className="text-sm font-medium tracking-wide">Processing query...</span>
              </div>
            ) : llmResponse ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-4" />
                  </div>
                  <p className="text-base leading-relaxed text-foreground text-pretty whitespace-pre-wrap">
                    {llmResponse}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <MessageSquareText className="size-6 opacity-50" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium">Awaiting your instruction</p>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="group relative flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-2 shadow-sm backdrop-blur-md transition-all duration-300 focus-within:border-primary/50 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10">
            <input
              type="text"
              placeholder={placeholder}
              value={prompt}
              disabled={isLoading}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Prompt"
              className="flex-1 bg-transparent px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isLoading || !prompt.trim()}
              onClick={handleSubmit}
              aria-label="Send prompt to AI"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? <Spinner className="size-5" /> : <ArrowUp className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}