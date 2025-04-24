import { Session } from "../../domain/entity/Session";
import { TokenFactory } from "../../infrastructure/tokens/TokenFactory";
import { LoginResponseDTO } from "../dtos/LoginResponseDTO";
import { FindUserById } from "../useCases/FindUserById";

/**
 * Service responsible for verifying a user's authentication token,
 * retrieving user data, and generating a session object.
 */
export class VerifyService {
  constructor(
    // Use case for finding a user by their ID.
    private readonly useCase: FindUserById
  ) {}

  /**
   * Verifies the authentication token, validates the user, and returns a session response DTO.
   *
   * @param token - JWT access token to be verified.
   * @returns A DTO containing the user information and session details.
   * @throws Error if the token is invalid or the user is not found.
   */
  async run(token: string) {
    // Step 1: Initialize token handler using the token factory.
    const tokenFactory = new TokenFactory();
    const tokenHandler = tokenFactory.createToken("JWT");

    // Step 2: Attempt to verify and decode the token.
    const user = await tokenHandler.verifyToken(token);
    if (!user) return; // Invalid or expired token

    // Step 3: Find the user in the database using the ID from the token payload.
    const userFound = await this.useCase.run(user.id);
    if (!userFound) {
      throw new Error("User not found");
    }

    // Step 4: Create a session with an expiration time (e.g., 8 hours from now).
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);
    const session = new Session(user.id, token, new Date(), expiresAt);

    // Step 5: Build and return the response DTO.
    const verifyResponse: LoginResponseDTO = {
      user: {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
      },
      session: {
        accessToken: session.accessToken,
        expiresAt: session.expiresAt,
      },
    };

    return verifyResponse;
  }
}
