import express from "express";
import { adminController } from "../controllers";

const adminRouter = express.Router();

adminRouter.get("/health", adminController.health);

adminRouter.post("/pledges", adminController.getPledges);

adminRouter.post("/sno_list", adminController.getSnoList);

export default adminRouter;
