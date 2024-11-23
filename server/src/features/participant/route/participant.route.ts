import express from "express";
import { participantController } from "@/features/participant/controller/participant.controller";
const participantRouter = express.Router();

participantRouter.get("/", participantController.getAllParticipants);
participantRouter.post("/", participantController.createParticipant);
participantRouter.put("/:id", participantController.updateParticipant);
participantRouter.delete("/:id", participantController.deleteParticipant);
participantRouter.get("/:id", participantController.getParticipantById);

export default participantRouter;
