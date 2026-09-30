import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./modules/auth";
import { userRouter } from "./modules/users";
import { conversationRouter } from "./modules/conversations";
import { messageRouter } from "./modules/messages";
import { chatbotRouter } from "./modules/chatbot";

dotenv.config();

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.use((req, res, next) => {
  if (req.headers.origin === clientOrigin) {
    res.setHeader("Access-Control-Allow-Origin", clientOrigin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.append("Vary", "Origin");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
});

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chatbot", chatbotRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chatbot API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ success: false, message: "Internal server error." });
});
