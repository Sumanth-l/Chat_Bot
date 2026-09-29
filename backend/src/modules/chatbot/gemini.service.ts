export interface GeminiGenerationOptions {
  prompt: string;
  model?: string;
}

export async function generateText(options: GeminiGenerationOptions): Promise<string> {
  // TODO: Call Gemini using a server-side API key from validated environment configuration.
  // TODO: Set request timeouts, handle provider errors, and avoid logging private prompts.
  void options;
  throw new Error('Gemini integration is not implemented yet.');
}
