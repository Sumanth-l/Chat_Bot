import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookieHeader = req.headers.cookie ?? "";
  const accessCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("accessToken="));
  const cookieToken = accessCookie?.slice("accessToken=".length);
  const token = cookieToken;

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
