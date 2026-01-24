import express from "express";
import type { Application } from "express";
import CookieParser from 'cookie-parser';
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { rootRouter } from "./routes/root.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { usersRouter } from "./routes/users.js";
import UrlRouter from "./routes/url.js";
import errorMiddleWare from "./error.js";
import { API_PREFIX } from "./config/constants.js";



export const app: Application = express();

app.use(express.json());
app.use(CookieParser());

const apiRouter = express.Router();

apiRouter.all("/auth/*splat", toNodeHandler(auth));
// built in better auth routes.
// Register	POST /api/v1/auth/sign-up/email	{ name, email, password }
// Login	POST /api/v1/auth/sign-in/email	{ email, password }
// Logout	POST /api/v1/auth/sign-out	-
// Get Session	GET /api/v1/auth/get-session	-

apiRouter.use("/", rootRouter);
apiRouter.post("/ai", async (req, res) => {
  const { prompt } = req.body;
  const result = streamText({
    model: google("gemini-flash-latest"),
    prompt: prompt,
  });

  result.pipeUIMessageStreamToResponse(res);
});
apiRouter.use("/users", usersRouter);
apiRouter.use("/url", UrlRouter);

apiRouter.post("/setlocal", (req, res) => {


  return res.send("helo")
})

app.use(API_PREFIX, apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorMiddleWare);
