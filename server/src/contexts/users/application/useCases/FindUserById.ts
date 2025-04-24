import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

/**
 * Application service responsible for finding a user by their ID.
 */
export class FindUserById {
  constructor(private readonly repository: IUserRepository) {}

  /**
   * Executes the use case to find a user by ID.
   *
   * @param id - The unique identifier of the user to find
   * @returns The found user or throws an error if not found
   * @throws Error if user is not found
   */
  async run(id: string) {
    const user = await this.repository.findById(id);
    if (!user) throw new Error("User not found");
    return user ? user : null;
  }
}
