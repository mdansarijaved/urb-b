import express from "express";
import cors from "cors"
import type { Application } from "express";
import CookieParser from 'cookie-parser';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import errorMiddleWare from "./error";
import { API_PREFIX } from "./config/constants";
import UrlRouter from "./routes/url";
import { urlService } from "./service/urlserice";
import { rootRouter } from "./routes/root";



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
// built in better auth routes.
// Register	POST /api/v1/auth/sign-up/email	{ name, email, password }
// Login	POST /api/v1/auth/sign-in/email	{ email, password }
// Logout	POST /api/v1/auth/sign-out	-
// Get Session	GET /api/v1/auth/get-session	-


app.use("/", rootRouter)
apiRouter.use("/url", UrlRouter)





app.use(API_PREFIX, apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorMiddleWare);
