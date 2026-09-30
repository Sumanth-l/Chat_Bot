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
    return prisma.$transaction(async (transaction) => {
      const conversation = await transaction.conversation.findFirst({
        where: { id, userId },
        select: { id: true },
      });
      if (!conversation) return false;

      await transaction.message.deleteMany({ where: { conversationId: id } });
      await transaction.conversation.delete({ where: { id } });
      return true;
    });
  }
}

export const conversationService =
  new ConversationService();
