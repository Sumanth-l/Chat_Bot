export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIProvider {
  readonly name: "gemini" | "groq";
  assertConfigured(): void;
  generateResponse(prompt: string, history: AIMessage[]): Promise<string>;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: AIProvider["name"],
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}
