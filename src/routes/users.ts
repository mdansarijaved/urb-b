import { Router } from "express";
import type { Router as ExpressRouter } from "express";

export const usersRouter: ExpressRouter = Router();

usersRouter.post("/", (req, res) => {
  res.sendStatus(501);
});
