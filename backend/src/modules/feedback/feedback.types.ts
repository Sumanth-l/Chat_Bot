export const feedbackTypes = [
  "LIKE",
  "DISLIKE",
  "BUG_REPORT",
  "FEATURE_REQUEST",
  "GENERAL",
] as const;

export type FeedbackType = (typeof feedbackTypes)[number];

export interface SubmitFeedbackInput {
  conversationId: string;
  messageId: string;
  type: FeedbackType;
  rating?: number;
  comment?: string;
}
