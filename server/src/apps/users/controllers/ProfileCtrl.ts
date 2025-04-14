import { NextFunction, Request, Response } from "express";

export class ProfileCtrl {
  async run(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json("Profile ok");
    } catch (e) {
      next(e);
    }
  }
}
