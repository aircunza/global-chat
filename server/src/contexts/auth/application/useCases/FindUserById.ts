import { IAuthRepository } from "../../domain/repository/IAuthRepository.rp";

export class FindUserById {
  constructor(private readonly repository: IAuthRepository) {}
  async run(id: string) {
    const user = await this.repository.findById(id);
    if (!user) throw new Error("User not found");
    return user ? user : null;
  }
}
