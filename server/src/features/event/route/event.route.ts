import express from "express";
import { eventController } from "@/features/event/controller/event.controller";
import { validateSchema } from "@/globals/middlewares/validate.middleware";
import {
  addEndEventSchema,
  addEventSchema,
  addStartEventSchema,
} from "../schema/event.shema";
const eventRouter = express.Router();

eventRouter.post(
  "/start",
  validateSchema(addStartEventSchema),
  eventController.addStartEvent
);
eventRouter.post(
  "/end",
  validateSchema(addEndEventSchema),
  eventController.addEndEvent
);
eventRouter.post("/", validateSchema(addEventSchema), eventController.addEvent);

export default eventRouter;
