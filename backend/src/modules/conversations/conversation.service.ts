import prisma from "../../config/prisma";

class ConversationService {
  async createConversation(
    userId: string,
    title: string
  ) {
    return prisma.conversation.create({
      data: {
        title,
        userId,
      },
    });
  }

  async getUserConversations(
    userId: string
  ) {
    return prisma.conversation.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deleteConversation(
    id: string,
    userId: string
  ) {
    return prisma.conversation.delete({
      where: {
        id,
        userId,
      },
    });
  }
}

export const conversationService =
  new ConversationService();