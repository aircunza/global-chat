import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { UserCreator } from "../../../contexts/users/application/useCases/UserCreator";
import { UserDTO } from "../dtos/UserDto";
import { IController } from "./IController";

export class CreateUserCtrl implements IController {
  constructor(private application: UserCreator) {}
  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, email, password } = req.body;
      const user = await this.application.run({ id, name, email, password });
      const result = UserDTO.fromEntity(user);
      res.status(httpStatus.CREATED).send(result);
    } catch (e) {
      next(e);
    }
  }
}
