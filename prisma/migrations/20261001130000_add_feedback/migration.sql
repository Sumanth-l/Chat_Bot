CREATE TYPE "FeedbackType" AS ENUM ('LIKE', 'DISLIKE', 'BUG_REPORT', 'FEATURE_REQUEST', 'GENERAL');

CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "rating" INTEGER,
    "type" "FeedbackType" NOT NULL,
    "comment" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Feedback_rating_check" CHECK (
        ("type" = 'GENERAL' AND "rating" BETWEEN 1 AND 5) OR
        ("type" <> 'GENERAL' AND "rating" IS NULL)
    ),
    CONSTRAINT "Feedback_required_comment_check" CHECK (
        "type" NOT IN ('BUG_REPORT', 'FEATURE_REQUEST') OR
        ("comment" IS NOT NULL AND length(btrim("comment")) > 0)
    )
);

CREATE UNIQUE INDEX "Feedback_userId_messageId_type_key" ON "Feedback"("userId", "messageId", "type");
CREATE INDEX "Feedback_conversationId_createdAt_idx" ON "Feedback"("conversationId", "createdAt");
CREATE INDEX "Feedback_messageId_idx" ON "Feedback"("messageId");
CREATE INDEX "Feedback_userId_createdAt_idx" ON "Feedback"("userId", "createdAt");

ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
