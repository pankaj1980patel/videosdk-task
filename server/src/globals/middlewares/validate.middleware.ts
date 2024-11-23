import { NextFunction, Request, Response } from "express";
import Joi, { Schema } from "joi";

const formatJoiMessage = (error: Joi.ValidationError) => {
  if (!error) return;
  return error.details.map((err) => err.message.replace(/"/g, ""));
};
export const validateSchema = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message.replace(/"/g, "")
      });
    }
    next();
  };
};
