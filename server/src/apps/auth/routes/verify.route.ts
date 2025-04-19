import { NextFunction, Request, Response, Router } from "express";

import { authGuard } from "../../../contexts/auth/infrastructure/middleware/AuthGuar";
import { VerifyCtrl } from "../controllers/VerifyCtrl";
import container from "../dependency-injection";

export function register(router: Router) {
  const controller: VerifyCtrl = container.get(
    "Apps.auth.controllers.VerifyCtrl"
  );
  router.get(
    "/verify",
    authGuard,
    function (req: Request, res: Response, next: NextFunction) {
      controller.run(req, res, next);
    }
  );
}
