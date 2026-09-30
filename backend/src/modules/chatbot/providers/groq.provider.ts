import Groq from "groq-sdk";
import type { AIMessage, AIProvider } from "./ai-provider";
import { AIProviderError } from "./ai-provider";

const DEFAULT_MODEL = "openai/gpt-oss-20b";
const DEFAULT_TIMEOUT_MS = 30_000;

function getStatus(error: unknown): number | undefined {
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === "number" ? status : undefined;
}

export class GroqProvider implements AIProvider {
  readonly name = "groq" as const;

  assertConfigured(): void {
    if (!process.env.GROQ_API_KEY?.trim()) {
      throw new AIProviderError("Groq API is not configured.", this.name, 503);
    }
  }

  async generateResponse(prompt: string, history: AIMessage[]): Promise<string> {
    this.assertConfigured();

    const apiKey = process.env.GROQ_API_KEY!.trim();
    const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;
    const configuredTimeout = Number(process.env.GROQ_REQUEST_TIMEOUT_MS);
    const timeout = Number.isFinite(configuredTimeout) && configuredTimeout > 0
      ? configuredTimeout
      : DEFAULT_TIMEOUT_MS;
    const client = new Groq({ apiKey, timeout, maxRetries: 2 });

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          ...history.map(({ role, content }) => ({ role, content })),
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 2048,
      });
      const response = completion.choices[0]?.message.content?.trim();
      if (!response) throw new Error("Groq returned an empty response.");
      return response;
    } catch (error) {
      const status = getStatus(error);
      const rawMessage = error instanceof Error ? error.message : "Unknown Groq error";
      const safeMessage = rawMessage
        .split(apiKey).join("[REDACTED_API_KEY]")
        .split(prompt).join("[REDACTED_USER_MESSAGE]")
        .slice(0, 1000);
      console.error("Groq generation failed", {
        model,
        errorName: error instanceof Error ? error.name : "UnknownError",
        status,
        message: safeMessage,
      });

      const statusCode = status === 401 || status === 403 || status === 429 || status === 503
        ? 503
        : 502;
      throw new AIProviderError("Groq request failed.", this.name, statusCode);
    }
  }
}

export const groqProvider = new GroqProvider();
