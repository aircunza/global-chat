import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

/**
 * Application service to retrieve all users.
 * Uses the IUserRepository interface to abstract data access.
 */
export class FindAllUsers {
  constructor(private readonly repository: IUserRepository) {}

  /**
   * Executes the use case to fetch all users from the repository.
   *
   * @returns A Promise resolving to an array of users.
   */
  async run() {
    const result = await this.repository.findAll();
    return result;
  }
}
