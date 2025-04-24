import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

/**
 * Application service to find a user by their email address.
 * Uses the IUserRepository interface to abstract data access.
 */
export class FindUserByEmail {
  constructor(private readonly repository: IUserRepository) {}

  /**
   * Executes the use case to find a user by email.
   *
   * @param email - The email address of the user to find.
   * @returns A Promise resolving to the user object if found.
   * @throws An error if no user is found with the given email.
   */
  async run(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("User not found");
    return user ? user : null; // Redundant check; could just return `user`
  }
}
