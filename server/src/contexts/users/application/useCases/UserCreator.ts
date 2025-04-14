import { User } from "../../domain/entity/User";
import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

export class UserCreator {
  constructor(private repository: IUserRepository) {}
  async run({ id, name, email, password }: User) {
    const user = new User({ id, name, email, password });
    return await this.repository.save(user);
  }
}
