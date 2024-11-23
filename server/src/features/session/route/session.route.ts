import express from "express";
import { sessionController } from "@/features/session/controller/session.controller";
import { validateSchema } from "@/globals/middlewares/validate.middleware";
import {
  addParticipantSchema,
  createSessionSchema,
  removeParticipantFromSessionSchema,
  updateSessionSchema,
} from "../shema/session.schema";

const sessionRouter = express.Router();

sessionRouter.get("/", sessionController.getAllSessions);
sessionRouter.post(
  "/",
  validateSchema(createSessionSchema),
  sessionController.createSession
);
sessionRouter.put(
  "/:id",
  validateSchema(updateSessionSchema),
  sessionController.updateSession
);
sessionRouter.delete("/:id", sessionController.deleteSession);
sessionRouter.get("/:id", sessionController.getSessionById);
sessionRouter.post(
  "/add-participant",
  validateSchema(addParticipantSchema),
  sessionController.addParticipant
);
sessionRouter.post(
  "/remove-participant",
  validateSchema(removeParticipantFromSessionSchema),
  sessionController.removeParticipantFromSession
);
export default sessionRouter;
