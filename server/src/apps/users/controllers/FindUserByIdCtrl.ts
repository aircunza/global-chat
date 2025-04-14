import { Request, Response } from "express";
import httpStatus from "http-status";

import { FindUserById } from "../../../contexts/users/application/useCases/FindUserById";
import { UserDTO } from "../dtos/UserDto";

export class FindUserByIdCtrl {
  constructor(private readonly application: FindUserById) {}
  async run(req: Request, res: Response) {
    try {
      const id = req.params?.id;
      const result = await this.application.run(id);
      const user = result ? UserDTO.fromEntity(result) : null;
      res.status(200).send(user);
    } catch (e) {
      res.status(httpStatus.NOT_FOUND).json(null);
    }
  }
}
