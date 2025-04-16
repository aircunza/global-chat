import { NextFunction, Request, Response, Router } from "express";

import { SingUpCtrl } from "../controllers/SingUpCtrl";
import container from "../dependency-injection";
import { ValidationAuthSchema } from "../middleware/ValidationAuhSchema";
import { SignUpSchema } from "../schemas/SignUpSchema";

export function register(router: Router) {
  const controller: SingUpCtrl = container.get(
    "Apps.auth.controllers.SingUpCtrl"
  );
  router.post(
    "/sign-up",
    ValidationAuthSchema(SignUpSchema),
    function (req: Request, res: Response, next: NextFunction) {
      controller.run(req, res, next);
    }
  );
}
