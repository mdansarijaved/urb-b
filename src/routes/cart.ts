import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { addCartItem, getProduct, listCartItems } from "../store/redisStore.js";
import { clearCartTimeout, scheduleCartTimeout } from "../queues/cartTimeout.js";

export const cartRouter: ExpressRouter = Router();

cartRouter.post("/items", async (req, res) => {
  const { id } = req.body;
  console.log(id);

  const product = await getProduct(id);
  if (!product) {
    res.status(404).send("Product not found");
    return;
  }
  await addCartItem(id);
  await scheduleCartTimeout();
  const currentCart = await listCartItems();
  res.json(currentCart);
});

cartRouter.get("/", async (req, res) => {
  const cartItems = await listCartItems();
  res.json(cartItems);
});

cartRouter.post("/checkout", async (req, res) => {
  await clearCartTimeout();
  res.sendStatus(204);
});
