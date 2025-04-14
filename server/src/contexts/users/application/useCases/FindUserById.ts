import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

export class FindUserById {
  constructor(private readonly repository: IUserRepository) {}
  async run(id: string) {
    const user = await this.repository.findById(id);
    if (!user) throw new Error("User not found");
    return user ? user : null;
  }
}
