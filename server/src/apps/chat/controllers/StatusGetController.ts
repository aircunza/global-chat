import { Request, Response } from "express";

import { IController } from "./IController";

export class StatusGetController implements IController {
  async run(req: Request, res: Response) {
    res.status(200).send("OKK");
  }
}
