import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { urlService } from "../service/urlserice";

export const rootRouter: ExpressRouter = Router();

rootRouter.get("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;
    console.log("I reached  ")

    const link = await urlService.getLongURL(code);

    if (!link) {
      return res.status(404).json({ message: "No matching url found." })
    }

    return res.redirect(link)
  } catch (error) {
    console.log(error);
    next(error)
  }
})