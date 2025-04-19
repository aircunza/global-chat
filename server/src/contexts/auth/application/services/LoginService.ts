import { timeStamp2dateTime } from "../../../shared/utils/handleDates";
import { Session } from "../../domain/entity/Session";
import { TokenFactory } from "../../infrastructure/tokens/TokenFactory";
import { LoginResponseDTO } from "../dtos/LoginResponseDTO";
import { FindUserByEmail } from "../useCases/FindUserByEmail";

/**
 * Service responsible for handling user login logic.
 * It validates user credentials, generates an access token,
 * creates a session, and returns a login response DTO.
 */
export class LoginService {
  constructor(private readonly findUserByEmailUC: FindUserByEmail) {}

  /**
   * Executes the login flow.
   *
   * @param {Object} params - Login input data.
   * @param {string} params.email - User email.
   * @param {string} params.password - User password.
   * @returns {Promise<LoginResponseDTO>} A DTO containing user info and session data.
   * @throws Will throw an error if user is not found, password is incorrect, or token generation fails.
   */
  async run({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<LoginResponseDTO> {
    // Attempt to find user by email
    const user = await this.findUserByEmailUC.run(email);
    if (!user) throw new Error("User not found");

    // Validate password (Note: this example assumes plain text comparison; hashing should be used in production)
    if (user.password !== password) throw new Error("Password incorrect");

    // Generate JWT token for the authenticated user
    const tokenFactory = new TokenFactory();
    const tokenHandler = tokenFactory.createToken("JWT");
    const result = await tokenHandler.generateToken({ id: user.id });

    // Validate token generation result
    if (!result || result?.iat === undefined || result?.exp === undefined) {
      throw new Error("Error generating token");
    }

    // Convert timestamps to DateTime format
    const createdAt = timeStamp2dateTime(result?.iat);
    const expiresAt = timeStamp2dateTime(result?.exp);

    // Create a new session entity
    const session = new Session(user.id, result.token, createdAt, expiresAt);

    // Format the final response as a DTO
    const loginResponse: LoginResponseDTO = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      session: {
        accessToken: session.accessToken,
        expiresAt: session.expiresAt,
      },
    };

    return loginResponse;
  }
}
