import { Router } from "express";
import { authController } from "../controllers";

const authRouter = Router();

authRouter.get("/health", authController.healthCheck);

export default authRouter;