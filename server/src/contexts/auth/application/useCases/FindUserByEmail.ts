import { IAuthRepository } from "../../domain/repository/IAuthRepository.rp";

export class FindUserByEmail {
  constructor(private readonly repository: IAuthRepository) {}
  async run(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("User not found");
    return user ? user : null;
  }
}
