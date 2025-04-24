import { JwtPayload } from "jsonwebtoken";

import { TokenFactory } from "./TokenFactory";

/**
 * Verifies a given JWT token and returns its payload.
 *
 * - Uses a token factory to create a handler for the JWT strategy.
 * - Attempts to verify the token and cast the result to a `JwtPayload`.
 * - Handles and rethrows errors with meaningful messages.
 *
 * @param token - The JWT access token to verify.
 * @returns The decoded JWT payload if verification is successful.
 * @throws An error if the token is invalid or verification fails.
 */
export async function verifyAuthToken(token: string): Promise<JwtPayload> {
  try {
    const tokenFactory = new TokenFactory();
    const tokenHandler = tokenFactory.createToken("JWT");

    // Verify the token and cast the result to JwtPayload
    const payload = (await tokenHandler.verifyToken(token)) as JwtPayload;

    return payload;
  } catch (e) {
    // Rethrow with a clear error message
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
