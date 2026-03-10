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

// Event Management APIs
adminRouter.post("/add_event", adminController.addEvent);

adminRouter.get("/get_event/:event_id", adminController.getEventById);

adminRouter.delete("/delete_event/:event_id", adminController.deleteEvent);

adminRouter.post("/list_events", adminController.listSubmittedEvents);

adminRouter.post("/list_draft_events", adminController.listDraftEvents);

adminRouter.post("/add_feedback", adminController.addFeedback);

adminRouter.post("/list_feedback", adminController.listFeedback);

export default adminRouter;
