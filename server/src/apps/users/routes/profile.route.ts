import { NextFunction, Request, Response, Router } from "express";

import { authGuard } from "../../../contexts/auth/infrastructure/middleware/AuthGuar";
import { ProfileCtrl } from "../controllers/ProfileCtrl";

export function register(router: Router) {
  router.get(
    "/profile",
    authGuard,
    async function (req: Request, res: Response, next: NextFunction) {
      const controller = new ProfileCtrl();
      await controller.run(req, res, next);
    }
  );
}
