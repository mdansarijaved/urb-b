import { Router } from "express";
import type { Router as ExpressRouter } from "express";

export const rootRouter: ExpressRouter = Router();

rootRouter.get("/", (req, res) => {
  res.send("hello");
});
