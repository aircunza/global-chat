import { NextFunction, Request, Response } from "express";

import container from "../../../../apps/auth/dependency-injection";
import { VerifyService } from "../../application/services/VerifyService";

/**
 * Middleware that protects routes by verifying the user's access token.
 * If the token is valid, the user information is attached to the request object.
 * Otherwise, it forwards the error to the next middleware.
 *
 * This guard relies on a cookie named "accessToken" containing a JWT.
 */
export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Resolve the VerifyService from the dependency injection container.
  const verifyService: VerifyService = container.get(
    "Contexts.auth.application.services.VerifyService"
  );

  try {
    // Extract access token from cookies.
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new Error("Missing or wrong token");
    }

    // Attempt to verify the token and retrieve user/session data.
    const result = await verifyService.run(accessToken);

    // Extra integrity check (optional, but looks like a placeholder or a safeguard).
    if (result?.user?.id !== result?.user.id) {
      throw new Error("Token corrupted");
    }

    // Attach verified user data to the request for downstream handlers.
    (req as any).user = result;

    // Continue to the next middleware or route handler.
    next();
  } catch (e) {
    // Forward any errors (e.g., invalid token, user not found) to the error handler.
    next(e);
  }
}
