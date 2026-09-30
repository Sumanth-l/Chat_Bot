import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { validateLoginInput } from "./auth.validation";

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

   async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation = validateLoginInput(req.body);
      if (!validation.success) {
        return res.status(400).json({ success: false, message: validation.message });
      }

      const data = await authService.login(
        validation.data.email,
        validation.data.password
      );

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };
      res.cookie("accessToken", data.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
      res.cookie("refreshToken", data.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user: data.user },
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid email or password") {
        return res.status(401).json({ success: false, message: error.message });
      }
      next(error);
    }
  }
}

export const authController = new AuthController();
