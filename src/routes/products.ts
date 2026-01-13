import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { listProducts, saveProduct } from "../store/redisStore.js";
import type { Product } from "../types.js";

export const productsRouter: ExpressRouter = Router();

productsRouter.post("/", async (req, res) => {
  const product = req.body as Product;
  console.log(product);
  await saveProduct(product);
  const products = await listProducts();
  res.json(products);
});

productsRouter.get("/", async (req, res) => {
  const products = await listProducts();
  res.json(products);
});
