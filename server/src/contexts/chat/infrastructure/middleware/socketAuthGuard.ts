import * as cookie from "cookie";
import { Socket } from "socket.io";

import { TokenFactory } from "../tokens/TokenFactory";

/**
 * Middleware-like function for authenticating a Socket.IO connection using cookies.
 *
 * - Extracts the `accessToken` from the socket's cookie header.
 * - Verifies the token using a token handler.
 * - Returns the authenticated user's ID if valid.
 *
 * @param socket - The Socket.IO connection attempting to authenticate.
 * @returns An object containing the authenticated user's ID, or `null` if authentication fails.
 */
export async function socketAuthGuard(socket: Socket) {
  try {
    // Retrieve the raw cookie header from the socket handshake
    const rawCookie = socket.handshake.headers["cookie"] || "";

    if (!rawCookie) return null; // No cookies found

    // Parse cookies and extract the access token
    const parsed = cookie.parse(rawCookie);
    const token = parsed["accessToken"];

    if (!token) return null; // No access token present

    // Create token handler and verify the token
    const tokenFactory = new TokenFactory();
    const tokenHandler = tokenFactory.createToken("JWT");
    const payload: any = await tokenHandler.verifyToken(token);

    // Return user ID from the token payload
    return { userId: payload.id };
  } catch (err) {
    console.error("Invalid socket auth:", err); // Log any errors
    return null; // Authentication failed
  }
}
