import Joi from "joi";
import {
  EVENT_TYPE,
  EVENT_TYPE_WITHOUT_ERROR,
} from "@/features/event/constant/eventType";

export const addStartEventSchema = Joi.object({
  participantId: Joi.string().required(),
  eventType: Joi.string()
    .valid(...Object.values(EVENT_TYPE))
    .required(),
  message: Joi.string().when("eventType", {
    is: EVENT_TYPE.ERROR,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

export const addEndEventSchema = Joi.object({
  participantId: Joi.string().required(),
  eventType: Joi.string()
    .valid(...Object.values(EVENT_TYPE_WITHOUT_ERROR))
    .required(),
});

export const addEventSchema = Joi.object({
  participantId: Joi.string().required(),
  eventData: Joi.object({
    type: Joi.string()
      .valid(...Object.values(EVENT_TYPE))
      .required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    message: Joi.string().when("type", {
      is: EVENT_TYPE.ERROR,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }).required(),
});
