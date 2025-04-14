import { Request, Response, Router } from "express";

export const register = (router: Router) => {
  router.get("/status-chat", async (req: Request, res: Response) => {
    res.status(200).send("ok chat");
  });
};
