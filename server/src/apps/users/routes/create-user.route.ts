import { NextFunction, Request, Response, Router } from "express";

import { authGuard } from "../../../contexts/auth/infrastructure/middleware/AuthGuar";
import { CreateUserCtrl } from "../controllers/CreateUserCtrl";
import container from "../dependency-injection";
import { validateSchema } from "../middleware/ValidateSchema";
import { userSchema } from "../schemas/UserSchema";

export function register(router: Router) {
  const controller: CreateUserCtrl = container.get(
    "Apps.users.controller.CreateUserCtrl"
  );
  router.post(
    "/users",
    authGuard,
    validateSchema(userSchema),
    function (req: Request, res: Response, next: NextFunction) {
      controller.run(req, res, next);
    }
  );
}
