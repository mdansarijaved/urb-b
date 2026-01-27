import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import crypto from "crypto"
import * as z from "zod";
import { urlService } from "../service/urlserice";
import { attachUser } from "../middlewares/user.middleware";


const UrlRouter: ExpressRouter = Router();


const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateCode(length = 6) {
  const bytes = crypto.randomBytes(length);
  let code = "";

  for (let i = 0; i < length; i++) {
    // @ts-expect-error
    code += ALPHABET[bytes[i] % 62];
  }

  return code;
}

UrlRouter.post("/", attachUser, async (req, res) => {

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

export default UrlRouter;
