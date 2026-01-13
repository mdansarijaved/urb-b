import express from "express";
import type { Application } from "express";
import { cartRouter } from "./routes/cart.js";
import { productsRouter } from "./routes/products.js";
import { rootRouter } from "./routes/root.js";
import { usersRouter } from "./routes/users.js";
import UrlRouter from "./routes/url.js";
import errorMiddleWare from "./error.js";

export const app: Application = express();

app.use(express.json());
app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/url", UrlRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorMiddleWare);
