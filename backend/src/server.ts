import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./modules/auth";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chatbot API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
