import { NextFunction, Request, Response } from "express";

import container from "../../../../apps/auth/dependency-injection";
import { VerifyService } from "../../application/services/VerifyService";

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyService: VerifyService = container.get(
    "Contexts.auth.application.services.VerifyService"
  );

  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new Error("Missing or wrong token");
    }

    const result = await verifyService.run(accessToken);

    if (result?.user?.id !== result?.user.id) {
      throw new Error("Token corrupted");
    }

    (req as any).user = result;

    next();
  } catch (e) {
    next(e);
  }
}
