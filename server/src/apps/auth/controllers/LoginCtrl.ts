import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { LoginService } from "../../../contexts/auth/application/services/LoginService";

export class LoginCtrl {
  constructor(private readonly service: LoginService) {}

  async run(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const result = await this.service.run({ email, password });

      res.cookie("accessToken", result.session.accessToken, {
        httpOnly: true, // Protects against XSS
        secure: false, // "true" for Only sent over HTTPS (recommended in production)
        sameSite: "strict", // Controls sending in cross-site requests
      });
      res.status(httpStatus.OK).send(result);
    } catch (e) {
      next(e);
    }
  }
}
