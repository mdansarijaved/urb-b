import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import crypto from "crypto"
import * as z from "zod";
import { urlService } from "../service/urlserice.js";
import { attachUser } from "../middlewares/user.middleware.js";


const UrlRouter: ExpressRouter = Router();


const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateCode(length = 6) {
  const bytes = crypto.randomBytes(length);
  let code = "";

  for (let i = 0; i < length; i++) {
    const b = bytes[i] ?? 0;
    code += ALPHABET[b % 62] ?? "";
  }

  return code;
}

UrlRouter.post("/", async (req, res) => {

  try {
    const { url } = req.body;
    const code = generateCode();

    await urlService.createShortURL(url, code, req.user);

    return res.send(code)

  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.message
      })
    }
    return res.status(400).json({
      message: "something went wrong"
    })
  }

});


UrlRouter.get("/", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    console.log(limit, offset, page)
    const userUrl = await urlService.getUserURls(limit, offset, req.user?.id)

    return res.status(200).json(userUrl);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong."
    })
  }
})

export default UrlRouter;
