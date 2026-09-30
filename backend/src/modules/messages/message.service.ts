import prisma from "../../config/prisma";

export class MessageService {
  async createMessage(
    userId: string,
    conversationId: string,
    content: string,
    role: "USER" | "ASSISTANT"
  ) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });
    if (!conversation) return null;

    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        role,
      },
    });

    return message;
  }

  async getMessages(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });
    if (!conversation) return null;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  }

  async getMessageById(messageId: string, userId: string) {
    const message = await prisma.message.findFirst({
      where: { id: messageId, conversation: { is: { userId } } },
    });

    return message;
  }

  async deleteMessage(messageId: string, userId: string) {
    const result = await prisma.message.deleteMany({
      where: { id: messageId, conversation: { is: { userId } } },
    });

    return result.count > 0 ? {
      message: "Message deleted successfully",
    } : null;
  }
}

export const messageService = new MessageService();
