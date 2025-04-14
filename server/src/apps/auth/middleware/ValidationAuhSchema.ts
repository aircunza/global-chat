import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

import { LoginSchemaType } from "../schemas/LoginSchema";

export function ValidationAuthSchema(schema: ZodType<LoginSchemaType>) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({ errors: e.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
