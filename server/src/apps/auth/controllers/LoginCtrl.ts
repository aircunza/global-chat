import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { LoginService } from "../../../contexts/auth/application/services/LoginService";

export class LoginCtrl {
  constructor(private readonly service: LoginService) {}

  async run(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const result = await this.service.run({ email, password });
      res.status(httpStatus.OK).send(result);
    } catch (e) {
      next(e);
    }
  }
}
