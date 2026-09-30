import { Router } from "express";
import { authController } from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh.bind(authController));
router.get("/me", protect, authController.currentUser.bind(authController));
router.post("/logout", protect, authController.logout.bind(authController));

export default router;
