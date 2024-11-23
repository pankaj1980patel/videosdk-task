import Joi from "joi";

export const createSessionSchema = Joi.object({
  meetingId: Joi.string().required(),
  start: Joi.date().optional(),
  end: Joi.date().optional(),
});

export const updateSessionSchema = Joi.object({
  meetingId: Joi.string().required(),
  start: Joi.date().optional(),
  end: Joi.date().optional(),
});

export const addParticipantSchema = Joi.object({
  meetingId: Joi.string().required(),
  participant: Joi.object({
    name: Joi.string().required(),
    participantId: Joi.string().required(),
  }),
});

export const removeParticipantFromSessionSchema = Joi.object({
  id: Joi.string().required(),
});
