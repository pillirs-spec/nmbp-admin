import express from "express";
import { userController } from "../controllers/usersController";

const userRouter = express.Router();

userRouter.get("/health", userController.health);

export default userRouter;