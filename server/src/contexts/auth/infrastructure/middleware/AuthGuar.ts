import { NextFunction, Request, Response } from "express";

import container from "../../../../apps/users/dependency-injection";
import { FindUserById } from "../../../users/application/useCases/FindUserById";
import { verifyAuthToken } from "../tokens/verifyAuthToken";

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userUseCase: FindUserById = container.get(
    "Contexts.users.application.useCases.FindUserById"
  );

  try {
    const authHeader = req.headers["authorization"];

    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer")) {
      throw new Error("Missing or wrong token");
    }
    const token = authHeader.split(" ")[1];
    const payload = await verifyAuthToken(token);

    const user = await userUseCase.run(payload.id);

    if (user?.id !== payload.id) {
      throw new Error("Token corrupted");
    }
    (req as any).user = user;

    next();
  } catch (e) {
    next(e);
  }
}
