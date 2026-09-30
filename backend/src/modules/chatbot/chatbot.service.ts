import { MessageRole } from "../../../generated/client-v3";
import prisma from "../../config/prisma";
import { AIProviderError, type AIMessage, type AIProvider } from "./providers/ai-provider";
import { geminiProvider } from "./providers/gemini.provider";
import { groqProvider } from "./providers/groq.provider";
import type { ChatbotReply, ChatbotRequest } from "./chatbot.types";

const MAX_MESSAGE_LENGTH = 10_000;
const HISTORY_LIMIT = 20;

export class ChatbotError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "ChatbotError";
  }
}

function toProviderHistory(messages: Array<{ role: string; content: string }>): AIMessage[] {
  const turns: AIMessage[] = [];
  let pendingUserMessage: string | undefined;

  for (const message of messages) {
    if (message.role === MessageRole.USER) {
      // Ignore an unanswered user message from a previous failed provider call.
      pendingUserMessage = message.content;
      continue;
    }

    if (message.role === MessageRole.ASSISTANT && pendingUserMessage !== undefined) {
      turns.push({ role: "user", content: pendingUserMessage });
      turns.push({ role: "assistant", content: message.content });
      pendingUserMessage = undefined;
    }
  }

  return turns;
}

function getProviders(): { primary: AIProvider; fallback: AIProvider } {
  const providers = { gemini: geminiProvider, groq: groqProvider };
  const selected = process.env.AI_PROVIDER?.trim().toLowerCase();
  const primary = selected === "groq" ? providers.groq : providers.gemini;
  const fallback = primary.name === "gemini" ? providers.groq : providers.gemini;
  return { primary, fallback };
}

async function generateWithFallback(
  primary: AIProvider,
  fallback: AIProvider,
  prompt: string,
  history: AIMessage[]
): Promise<string> {
  try {
    primary.assertConfigured();
    return await primary.generateResponse(prompt, history);
  } catch (primaryError) {
    const primaryStatus = primaryError instanceof AIProviderError ? primaryError.statusCode : 502;
    console.warn("Primary AI provider failed; trying fallback", {
      primary: primary.name,
      fallback: fallback.name,
      status: primaryStatus,
    });

    try {
      fallback.assertConfigured();
      return await fallback.generateResponse(prompt, history);
    } catch (fallbackError) {
      const fallbackStatus = fallbackError instanceof AIProviderError ? fallbackError.statusCode : 502;
      console.error("Primary and fallback AI providers failed", {
        primary: primary.name,
        primaryStatus,
        fallback: fallback.name,
        fallbackStatus,
      });
      const statusCode = primaryStatus === 503 && fallbackStatus === 503 ? 503 : 502;
      throw new ChatbotError("AI providers could not complete the request.", statusCode);
    }
  }
}

export async function reply(input: ChatbotRequest): Promise<ChatbotReply> {
  const conversationId = input.conversationId?.trim();
  const userId = input.userId?.trim();
  const userMessage = input.message?.trim();

  if (!conversationId) throw new ChatbotError("conversationId is required.", 400);
  if (!userId) throw new ChatbotError("Authentication is required.", 401);
  if (!userMessage) throw new ChatbotError("message is required.", 400);
  if (userMessage.length > MAX_MESSAGE_LENGTH) {
    throw new ChatbotError(`message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`, 400);
  }

  const { primary, fallback } = getProviders();
  const priorMessages = await prisma.$transaction(async (transaction) => {
    const conversation = await transaction.conversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });

    if (!conversation) throw new ChatbotError("Conversation not found.", 404);

    const currentUserMessage = await transaction.message.create({
      data: {
        conversationId,
        role: MessageRole.USER,
        content: userMessage,
      },
    });

    const priorMessages = await transaction.message.findMany({
      where: { conversationId, id: { not: currentUserMessage.id } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: HISTORY_LIMIT,
    });

    return priorMessages.reverse();
  });

  const aiResponse = await generateWithFallback(
    primary,
    fallback,
    userMessage,
    toProviderHistory(priorMessages)
  );

  const assistantMessage = await prisma.message.create({
    data: {
      conversationId,
      role: MessageRole.ASSISTANT,
      content: aiResponse,
    },
  });

  return {
    conversationId,
    userMessage,
    aiResponse: assistantMessage.content,
  };
}
