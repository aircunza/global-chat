import { NextFunction, Request, Response, Router } from "express";

import container from "../../auth/dependency-injection";
import { LoginCtrl } from "../controllers/LoginCtrl";
import { ValidationAuthSchema } from "../middleware/ValidationAuhSchema";
import { LoginSchema } from "../schemas/LoginSchema";

export function register(router: Router) {
  const controller: LoginCtrl = container.get(
    "Apps.auth.controllers.LoginCtrl"
  );
  router.post(
    "/login",
    ValidationAuthSchema(LoginSchema),
    function (req: Request, res: Response, next: NextFunction) {
      controller.run(req, res, next);
    }
  );
}
