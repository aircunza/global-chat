import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

import { UserSchemaType } from "../schemas/UserSchema";

export const validateSchema = (schema: ZodType<UserSchemaType>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
