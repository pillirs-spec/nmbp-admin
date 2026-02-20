import { Router } from "express";
import { adminController } from "../controllers";

const adminRouter = Router();

adminRouter.get("/validateToken", adminController.validateToken);

adminRouter.post("/login", adminController.login);

adminRouter.post("/logout", adminController.logout);

adminRouter.post("/getForgetPasswordOtp", adminController.getForgetPasswordOtp);

adminRouter.post("/verifyForgetPasswordOtp", adminController.verifyForgetPasswordOtp);

adminRouter.post("/resetForgetPassword", adminController.resetForgetPassword);

adminRouter.post("/getLoginOtp", adminController.getLoginOtp);

adminRouter.post("/verifyLoginOtp", adminController.verifyLoginOtp);

export default adminRouter;