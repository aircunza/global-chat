import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

export class FindUserByEmail {
  constructor(private readonly repository: IUserRepository) {}
  async run(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("User not found");
    return user ? user : null;
  }
}
