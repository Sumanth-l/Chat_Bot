import prisma from "../../config/prisma";
import type { SubmitFeedbackInput } from "./feedback.types";

export class FeedbackService {
  async submitFeedback(userId: string, input: SubmitFeedbackInput) {
    const message = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        conversationId: input.conversationId,
        role: "ASSISTANT",
        conversation: { is: { userId } },
      },
      select: { id: true },
    });
    if (!message) return null;

    return prisma.$transaction(async (transaction) => {
      if (input.type === "LIKE" || input.type === "DISLIKE") {
        await transaction.feedback.deleteMany({
          where: {
            userId,
            messageId: input.messageId,
            type: input.type === "LIKE" ? "DISLIKE" : "LIKE",
          },
        });
      }

      return transaction.feedback.upsert({
        where: {
          userId_messageId_type: {
            userId,
            messageId: input.messageId,
            type: input.type,
          },
        },
        create: {
          userId,
          conversationId: input.conversationId,
          messageId: input.messageId,
          type: input.type,
          rating: input.rating,
          comment: input.comment,
        },
        update: {
          rating: input.rating,
          comment: input.comment,
        },
      });
    });
  }

  async getConversationFeedback(userId: string, conversationId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });
    if (!conversation) return null;

    return prisma.feedback.findMany({
      where: { userId, conversationId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const feedbackService = new FeedbackService();
