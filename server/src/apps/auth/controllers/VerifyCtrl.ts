import { NextFunction, Request, Response } from "express";

import { VerifyService } from "../../../contexts/auth/application/services/VerifyService";

export class VerifyCtrl {
  constructor(private readonly service: VerifyService) {}
  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.accessToken;

      const result = await this.service.run(token);

      res.cookie("accessToken", token, {
        httpOnly: true, // Protects against XSS
        secure: false, // "true" for Only sent over HTTPS (recommended in production)
        sameSite: "strict", // Controls sending in cross-site requests
      });

      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}
