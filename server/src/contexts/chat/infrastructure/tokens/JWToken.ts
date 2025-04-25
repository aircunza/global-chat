import jwt from "jsonwebtoken";

import { configApps } from "../../../../apps/config";
import { CustomPayload, TokenHandler } from "./TokenHandler";

/**
 * JWT implementation of a token handler for authentication.
 *
 * - Responsible for generating and verifying JSON Web Tokens (JWT).
 * - Inherits from the base TokenHandler interface.
 */
export class JWToken extends TokenHandler {
  private readonly secretKey: string;

  constructor() {
    super();
    // Load the secret key from the application configuration
    this.secretKey = configApps.jwtSecret;
  }

  /**
   * Signs a payload and returns a JWT.
   *
   * @param payload - The data to include in the token.
   * @returns A signed JWT as a string.
   */
  private signToken(payload: CustomPayload): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.secretKey,
        { expiresIn: "24h" }, // Token expires in 24 hours
        function (err: Error | null, token: string | undefined) {
          if (err || !token) {
            reject(err); // Token creation failed
          } else {
            resolve(token); // Return the signed token
          }
        }
      );
    });
  }

  /**
   * Validates a JWT and returns its decoded payload.
   *
   * @param token - The JWT to validate.
   * @returns The decoded payload if the token is valid.
   */
  private validateToken(token: string): Promise<CustomPayload | undefined> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, function (err, payload) {
        if (err) {
          reject(err); // Token is invalid
        } else {
          resolve(payload as CustomPayload); // Return the decoded payload
        }
      });
    });
  }

  /**
   * Generates a new JWT for the provided payload.
   *
   * @param payload - The payload to encode in the token.
   * @returns A signed JWT or `undefined` if generation fails.
   */
  public async generateToken(
    payload: CustomPayload
  ): Promise<string | undefined> {
    try {
      const token = await this.signToken(payload);
      return token;
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error("Unknown error");
    }
  }

  /**
   * Verifies a JWT and returns the decoded payload.
   *
   * @param token - The JWT to verify.
   * @returns The decoded payload if the token is valid.
   */
  public async verifyToken(token: string): Promise<CustomPayload | undefined> {
    try {
      const payload = await this.validateToken(token);
      return payload;
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error("Unknown error");
    }
  }
}
