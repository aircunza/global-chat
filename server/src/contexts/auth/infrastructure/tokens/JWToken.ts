import jwt, { JwtPayload } from "jsonwebtoken";

import { configApps } from "../../../../apps/config";
import {
  AuthTokenPayload,
  TokenHandler,
} from "../../domain/entity/TokenHandler";

/**
 * JWTToken is a concrete implementation of TokenHandler for managing JWT tokens.
 *
 * - Supports generating and verifying JWT tokens.
 * - Uses a secret key configured in the application settings.
 */
export class JWTToken extends TokenHandler {
  private readonly secretKey: string;

  constructor() {
    super();
    this.secretKey = configApps.jwtSecret; // Load the JWT secret from app config
  }

  /**
   * Generates a signed JWT token based on the provided payload.
   *
   * - Sets the token to expire in 24 hours.
   * - Decodes the token after creation to extract issue/expiry times.
   *
   * @param payload - The payload to include in the token.
   * @returns An object containing the token, its expiration (`exp`), and issued-at time (`iat`), or null if generation fails.
   */
  async generateToken(payload: AuthTokenPayload) {
    try {
      const token = await jwt.sign(payload, this.secretKey, {
        expiresIn: "24h",
      });
      const decoded = jwt.decode(token) as JwtPayload;
      return { token, exp: decoded.exp, iat: decoded.iat };
    } catch (e) {
      return null; // Return null if token generation fails
    }
  }

  /**
   * Verifies the provided JWT token and returns the decoded payload.
   *
   * @param token - The JWT token to verify.
   * @returns The decoded token payload if valid.
   * @throws Error if verification fails.
   */
  async verifyToken(token: string): Promise<AuthTokenPayload | undefined> {
    try {
      const result = await jwt.verify(token, this.secretKey);
      return result as AuthTokenPayload;
    } catch (e) {
      throw new Error("Invalid Token"); // Handle verification failure
    }
  }
}
