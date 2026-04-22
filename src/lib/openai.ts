import OpenAI from 'openai'

// Lazy singleton — only throws at call time, not at module import.
// Agents that need OpenAI will fail gracefully at runtime if the key is absent.
let _client: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _client
}

// Named export for backwards compatibility with agents that do `import { openai }`
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return getOpenAIClient()[prop as keyof OpenAI]
  },
})
