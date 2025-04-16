import { User } from "../../domain/entity/User";
import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

export class UserCreator {
  constructor(private repository: IUserRepository) {}
  async run({ id, name, email, password }: User) {
    const userFoundByEmail = await this.repository.findByEmail(email);
    if (userFoundByEmail !== null) {
      throw new Error("Email already in use");
    }
    const userFoundById = await this.repository.findById(id);
    if (userFoundById !== null) throw new Error("User already exists");

    const user = new User({ id, name, email, password });
    return await this.repository.save(user);
  }
}
