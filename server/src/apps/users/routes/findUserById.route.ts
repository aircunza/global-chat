import { Request, Response, Router } from "express";

import { authGuard } from "../../../contexts/auth/infrastructure/middleware/AuthGuar";
import container from "../dependency-injection";

export function register(router: Router) {
  const controller = container.get("Apps.users.controller.FindUserByIdCtrl");
  router.get("/users/:id", authGuard, function (req: Request, res: Response) {
    controller.run(req, res);
  });
}
