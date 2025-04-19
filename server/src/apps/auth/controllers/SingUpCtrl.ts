import { NextFunction, Request, Response } from "express";

import { User } from "../../../contexts/auth/domain/entity/User";
import { SignUpService } from "./../../../contexts/auth/application/services/SignUpService";

export class SingUpCtrl {
  constructor(private readonly service: SignUpService) {}
  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body;
      const newUser = new User({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      });
      const result = await this.service.run(newUser);
      res.status(201).send(result);
    } catch (e) {
      next(e);
    }
  }
}
