import type { Content } from "@google/generative-ai";
import { GeminiServiceError, geminiService } from "../gemini.service";
import type { AIMessage, AIProvider } from "./ai-provider";
import { AIProviderError } from "./ai-provider";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini" as const;

  assertConfigured(): void {
    try {
      geminiService.assertConfigured();
    } catch (error) {
      if (error instanceof GeminiServiceError) {
        throw new AIProviderError(error.message, this.name, error.statusCode);
      }
      throw error;
    }
  }

  async generateResponse(prompt: string, history: AIMessage[]): Promise<string> {
    this.assertConfigured();
    const geminiHistory: Content[] = history.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    try {
      return await geminiService.generateResponse(geminiHistory, prompt);
    } catch (error) {
      if (error instanceof GeminiServiceError) {
        throw new AIProviderError(error.message, this.name, error.statusCode);
      }
      throw new AIProviderError("Gemini request failed.", this.name, 502);
    }
  }
}

export const geminiProvider = new GeminiProvider();
