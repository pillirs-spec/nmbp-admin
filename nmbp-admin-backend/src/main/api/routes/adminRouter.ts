import express from "express";
import { adminController } from "../controllers";

const adminRouter = express.Router();

adminRouter.get("/health", adminController.health);

adminRouter.post("/pledges", adminController.getPledges);

adminRouter.post("/sno_list", adminController.getSnoList);

adminRouter.post("/dno_list", adminController.getDnoList);

adminRouter.post("/add_documents", adminController.addDocuments);

adminRouter.post("/documents/list", adminController.listDocuments);

adminRouter.get("/documents/:document_id", adminController.getDocumentById);

adminRouter.put("/documents/:document_id", adminController.updateDocument);

adminRouter.get(
  "/documents/:document_id/download",
  adminController.downloadDocument,
);

export default adminRouter;
