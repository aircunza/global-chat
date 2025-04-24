import { User } from "../../domain/entity/User";
import { IUserRepository } from "../../domain/repository/IUserRepository.rp";

/**
 * Application service responsible for creating a new user.
 */
export class UserCreator {
  constructor(private repository: IUserRepository) {}

  /**
   * Executes the user creation process.
   *
   * @param id - Unique identifier of the user
   * @param name - Full name of the user
   * @param email - Email address of the user
   * @param password - Encrypted password of the user
   * @returns The created user
   * @throws Error if the email or ID is already in use
   */
  async run({ id, name, email, password }: User) {
    // Check if a user with the given email already exists
    const userFoundByEmail = await this.repository.findByEmail(email);
    if (userFoundByEmail !== null) {
      throw new Error("Email already in use");
    }

    // Check if a user with the given ID already exists
    const userFoundById = await this.repository.findById(id);
    if (userFoundById !== null) {
      throw new Error("User already exists");
    }

    // Create and persist the new user
    const user = new User({ id, name, email, password });
    return await this.repository.save(user);
  }
}
