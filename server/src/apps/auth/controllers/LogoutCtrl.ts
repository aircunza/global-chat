import { NextFunction, Request, Response } from "express";

export class LogoutCtrl {
  async run(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      res.send({ message: "Log out" });
    } catch (e) {
      next(e);
    }
  }
}
