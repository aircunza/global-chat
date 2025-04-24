import { User } from "../../domain/entity/User";
import { SignUpResponseDTO } from "../dtos/SignUpResponseDTO";
import { FindUserByEmail } from "../useCases/FindUserByEmail";
import { FindUserById } from "../useCases/FindUserById";
import { SaveUser } from "../useCases/SaveUser";

/**
 * Service responsible for handling the user sign-up process.
 */
export class SignUpService {
  constructor(
    // Use case for saving a new user to the database.
    private readonly saveUserUC: SaveUser,

    // Use case for finding a user by their email address.
    private readonly findUserByEmailUC: FindUserByEmail,

    // Use case for finding a user by their ID.
    private readonly findUserByIdUC: FindUserById
  ) {}

  /**
   * Executes the sign-up workflow:
   * 1. Checks if the email is already in use.
   * 2. Checks if the user ID already exists.
   * 3. Saves the new user to the database.
   * 4. Returns a DTO representation of the newly created user.
   *
   * @param user - The user entity to be registered.
   * @returns A DTO containing the user registration response.
   * @throws Error if the email or ID is already in use.
   */
  async run(user: User) {
    // Step 1: Check if a user with the same email already exists.
    const userFoundByEmail = await this.findUserByEmailUC.run(user.email);
    if (userFoundByEmail !== null) {
      throw new Error("Email already in use");
    }

    // Step 2: Check if a user with the same ID already exists.
    const userFoundById = await this.findUserByIdUC.run(user.id);
    if (userFoundById !== null) {
      throw new Error("User already exists");
    }

    // Step 3: Save the new user.
    const newUser = await this.saveUserUC.run(user);

    // Step 4: Convert the user entity into a response DTO and return it.
    const result = SignUpResponseDTO.fromEntity(newUser);
    return result;
  }
}
