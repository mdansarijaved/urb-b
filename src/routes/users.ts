import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { urlService } from "../service/urlserice";
import { attachUser } from "../middlewares/user.middleware";

export const usersRouter: ExpressRouter = Router();

usersRouter.post("/", (req, res) => {
  res.sendStatus(501);
});

