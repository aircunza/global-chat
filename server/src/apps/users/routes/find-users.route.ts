import { Request, Response, Router } from "express";

import { authGuard } from "../../../contexts/auth/infrastructure/middleware/AuthGuar";
import container from "../dependency-injection";

export const register = (router: Router) => {
  const controller = container.get("Apps.users.controller.FindAllUsersCtrl");
  router.get("/users", authGuard, (req: Request, res: Response) =>
    controller.run(req, res)
  );
};
