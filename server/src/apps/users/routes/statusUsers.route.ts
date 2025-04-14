import { Request, Response, Router } from "express";

import { StatusCtrl } from "../controllers/StatusCtrl";

export function register(router: Router) {
  const controller = new StatusCtrl();
  router.get("/status-users", (req: Request, res: Response) =>
    controller.run(req, res)
  );
}
