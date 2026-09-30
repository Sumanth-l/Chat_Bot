import { GoogleGenerativeAI, type Content } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

export class GeminiServiceError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "GeminiServiceError";
  }
}

function providerDiagnostics(error: unknown, apiKey: string, userMessage: string) {
  const providerError = error as {
    name?: unknown;
    message?: unknown;
    status?: unknown;
    statusText?: unknown;
  };
  const status = typeof providerError?.status === "number" ? providerError.status : undefined;
  const errorName = typeof providerError?.name === "string" ? providerError.name : "UnknownError";
  let message = typeof providerError?.message === "string" ? providerError.message : "Unknown Gemini error";

  // SDK errors can include request URLs; never allow the API key or prompt into logs.
  if (apiKey) message = message.split(apiKey).join("[REDACTED_API_KEY]");
  if (userMessage) message = message.split(userMessage).join("[REDACTED_USER_MESSAGE]");

  return {
    errorName,
    message: message.slice(0, 1000),
    status,
    statusText: typeof providerError?.statusText === "string" ? providerError.statusText : undefined,
  };
}

function isRetryable(diagnostics: ReturnType<typeof providerDiagnostics>): boolean {
  return [408, 429, 500, 502, 503, 504].includes(diagnostics.status ?? 0) ||
    /abort|timeout|fetch failed|network/i.test(`${diagnostics.errorName} ${diagnostics.message}`);
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

class GeminiAttemptError extends Error {
  constructor(
    readonly diagnostics: ReturnType<typeof providerDiagnostics>,
    readonly attempts: number
  ) {
    super("Gemini model request failed.");
  }
}

export class GeminiService {
  assertConfigured(): void {
    if (!process.env.GEMINI_API_KEY?.trim()) {
      throw new GeminiServiceError("Gemini API is not configured.", 503);
    }
  }

  async generateResponse(history: Content[], userMessage: string): Promise<string> {
    this.assertConfigured();

    const apiKey = process.env.GEMINI_API_KEY!.trim();
    const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
    const configuredTimeout = Number(process.env.GEMINI_REQUEST_TIMEOUT_MS);
    const timeout = Number.isFinite(configuredTimeout) && configuredTimeout > 0
      ? configuredTimeout
      : DEFAULT_TIMEOUT_MS;

    try {
      return await this.generateWithModel(modelName, apiKey, history, userMessage, timeout, MAX_ATTEMPTS);
    } catch (error) {
      this.logFailure(modelName, error);
      throw this.toServiceError(error);
    }
  }

  private async generateWithModel(
    modelName: string,
    apiKey: string,
    history: Content[],
    userMessage: string,
    timeout: number,
    maxAttempts: number
  ): Promise<string> {
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: modelName });

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const chat = model.startChat({ history, generationConfig: { maxOutputTokens: 2048 } });
        const result = await chat.sendMessage(userMessage, { timeout });
        const response = result.response.text().trim();
        if (!response) throw new Error("Gemini returned an empty response.");
        return response;
      } catch (error) {
        const diagnostics = providerDiagnostics(error, apiKey, userMessage);
        if (attempt < maxAttempts && isRetryable(diagnostics)) {
          const backoff = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
          await wait(backoff + Math.floor(Math.random() * 250));
          continue;
        }
        throw new GeminiAttemptError(diagnostics, attempt);
      }
    }

    throw new GeminiAttemptError(
      { errorName: "UnknownError", message: "No Gemini attempt completed.", status: undefined, statusText: undefined },
      maxAttempts
    );
  }

  private logFailure(model: string, error: unknown): void {
    if (error instanceof GeminiAttemptError) {
      console.error("Gemini generation failed", { model, attempts: error.attempts, ...error.diagnostics });
    } else {
      console.error("Gemini generation failed", { model, errorName: "UnknownError" });
    }
  }

  private toServiceError(error: unknown): GeminiServiceError {
    if (!(error instanceof GeminiAttemptError)) {
      return new GeminiServiceError("Gemini request failed.", 502);
    }
    const { diagnostics } = error;
    const statusCode = /abort|timeout/i.test(`${diagnostics.errorName} ${diagnostics.message}`)
      ? 504
      : diagnostics.status === 429 || diagnostics.status === 503
        ? 503
        : 502;
    return new GeminiServiceError("Gemini request failed.", statusCode);
  }
}

export const geminiService = new GeminiService();
