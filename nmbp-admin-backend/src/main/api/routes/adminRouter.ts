import express from "express";
import { adminController } from "../controllers";

const adminRouter = express.Router();

adminRouter.get("/health", adminController.health);

export default adminRouter;