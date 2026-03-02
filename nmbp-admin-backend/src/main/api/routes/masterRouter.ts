import express from "express";
import { masterController } from "../controllers";

const masterRouter = express.Router();

masterRouter.get("/states", masterController.getStates);

masterRouter.get("/districts/:state_id", masterController.getDistrictsByState);

masterRouter.get("/activities", masterController.getActivities);

export default masterRouter;
