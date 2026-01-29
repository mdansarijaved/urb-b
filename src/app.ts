import express from "express";
import cors from "cors"
import type { Application } from "express";
import CookieParser from 'cookie-parser';
import swaggerUi from "swagger-ui-express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import errorMiddleWare from "./error.js";
import { API_PREFIX } from "./config/constants.js";
import { openApiSpec } from "./config/openapi.js";
import UrlRouter from "./routes/url.js";
import { rootRouter } from "./routes/root.js";
import { usersRouter } from "./routes/users.js";
import { attachUser } from "./middlewares/user.middleware.js";

export const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const apiRouter = express.Router();
apiRouter.get("/openapi.json", (_req, res) => res.json(openApiSpec));
apiRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
apiRouter.all("/auth/*splat", toNodeHandler(auth));


apiRouter.use(CookieParser());
apiRouter.use(express.json());
apiRouter.use(attachUser);


app.use("/", rootRouter)
apiRouter.use("/url", UrlRouter)
apiRouter.use("/user", usersRouter);





app.use(API_PREFIX, apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorMiddleWare);
