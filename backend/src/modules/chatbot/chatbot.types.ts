export interface ChatbotRequest {
  conversationId: string;
  userId: string;
  message: string;
}

export interface ChatbotReply {
  conversationId: string;
  userMessage: string;
  aiResponse: string;
}
