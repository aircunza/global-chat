import { Request, Response } from "express";

import { FindAllUsers } from "../../../contexts/users/application/useCases/FindAllUsers";
import { UserDTO } from "../dtos/UserDto";

export class FindAllUsersCtrl {
  constructor(private readonly application: FindAllUsers) {}
  async run(req: Request, res: Response) {
    const users = await this.application.run();
    const result = users?.map((user) => UserDTO.fromEntity(user));
    res.status(200).send(result);
  }
}
