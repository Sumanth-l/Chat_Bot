import { generateText } from './gemini.service';
import type { ChatbotReply, ChatbotRequest } from './chatbot.types';

export async function reply(input: ChatbotRequest): Promise<ChatbotReply> {
  // TODO: Load conversation context and verify ownership with Prisma.
  // TODO: Persist user/assistant messages with Prisma after generation succeeds.
  const message = await generateText({ prompt: input.message });
  return { conversationId: input.conversationId, message };
}
