import { JWTToken } from "./JWToken";

/**
 * Factory class responsible for creating token handler instances based on type.
 *
 * - Currently supports "JWT" tokens.
 * - Throws an error if an unsupported type is requested.
 */
export class TokenFactory {
  /**
   * Creates and returns a token handler instance based on the specified type.
   *
   * @param type - The type of token to create ("JWT" is supported).
   * @returns A token handler instance (e.g., JWTToken).
   * @throws Error if the token type is not allowed or unsupported.
   */
  createToken(type: string) {
    switch (type) {
      case "JWT":
        return new JWTToken(); // Return a JWT token handler
      case "OAuth":
        throw new Error("Type of token not allowed"); // Explicitly reject unsupported types
      default:
        return new JWTToken(); // Default to JWT if type is unrecognized
    }
  }
}
