import prisma from "../../config/prisma";

export class MessageService {
  async createMessage(
    conversationId: string,
    content: string,
    role: "USER" | "ASSISTANT"
  ) {
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        role,
      },
    });

    return message;
  }

  async getMessages(conversationId: string) {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  }

  async getMessageById(messageId: string) {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    return message;
  }

  async deleteMessage(messageId: string) {
    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return {
      message: "Message deleted successfully",
    };
  }
}

export const messageService = new MessageService();