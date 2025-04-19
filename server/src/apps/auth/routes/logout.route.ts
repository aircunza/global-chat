import { NextFunction, Request, Response, Router } from "express";

import { LogoutCtrl } from "../controllers/LogoutCtrl";

export function register(router: Router) {
  router.post(
    "/logout",
    async function (req: Request, res: Response, next: NextFunction) {
      const controller = new LogoutCtrl();
      await controller.run(req, res, next);
    }
  );
}
