import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

export class FindAllUsers {
  constructor(private readonly repository: IUserRepository) {}

  async run() {
    const result = await this.repository.findAll();
    return result;
  }
}
