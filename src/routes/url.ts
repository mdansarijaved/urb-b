import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import crypto from "crypto"
import { prisma } from "../lib/prisma";
import * as z from "zod";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";


const urlSchema = z.object({
  url: z.url({
    protocol: /^https?$/
  }),
  code: z.string()
})


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

UrlRouter.post("/", async (req, res) => {

  try {

    const { url } = req.body;
    const code = generateCode();
    const user = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    const parsed = urlSchema.parse({ url, code })


    await prisma.link.create({
      data: {
        originalUrl: parsed.url,
        shortCode: parsed.code,
        userId: user?.user.id ?? null
      }
    })


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
