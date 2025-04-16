import { User } from "../../domain/entity/User";
import { IAuthRepository } from "../../domain/repository/IAuthRepository.rp";

export class SaveUser {
  constructor(private readonly repository: IAuthRepository) {}

  async run(user: User) {
    return await this.repository.save(user);
  }
}
