import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { urlService } from "../service/urlserice";
import { attachUser } from "../middlewares/user.middleware";

export const usersRouter: ExpressRouter = Router();

usersRouter.post("/", (req, res) => {
  res.sendStatus(501);
});

usersRouter.get("/url", async (req, res) => {

  try {
    const userUrl = await urlService.getUserURls(req.user?.id)

    return res.status(200).json(userUrl);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error
    })
  }
})