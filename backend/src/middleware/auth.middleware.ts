import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function protect(req: Request, res: Response, next: NextFunction) {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("accessToken="));
  const token = cookie?.slice("accessToken=".length);

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }

  try {
    res.locals.userId = verifyAccessToken(decodeURIComponent(token));
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired access token." });
  }
}
