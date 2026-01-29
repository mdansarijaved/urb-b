import express from "express";
import cors from "cors"
import type { Application } from "express";
import CookieParser from 'cookie-parser';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import errorMiddleWare from "./error.js";
import { API_PREFIX } from "./config/constants.js";
import UrlRouter from "./routes/url.js";
import { rootRouter } from "./routes/root.js";



export const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const apiRouter = express.Router();
apiRouter.all("/auth/*splat", toNodeHandler(auth));

apiRouter.use(CookieParser());
apiRouter.use(express.json());


app.use("/", rootRouter)
apiRouter.use("/url", UrlRouter)





app.use(API_PREFIX, apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorMiddleWare);
