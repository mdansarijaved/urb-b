import { Router } from "express";
import type { Router as ExpressRouter } from "express";

const UrlRouter: ExpressRouter = Router();

UrlRouter.get("/", (req, res, next) => {
  return next(new Error("nothing here"));
});

UrlRouter.post("/shortens", async (req, res) => {
  const { url } = req.body;
});

export default UrlRouter;
