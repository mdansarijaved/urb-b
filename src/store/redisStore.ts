import { redisClient } from "../config/redis.js";
import type { Product, shortURL } from "../types.js";

const PRODUCTS_KEY = "products";
const CART_ITEMS_KEY = "cart:items";
const URL_KEY = "shorturl";

const parseProduct = (value: string | null): Product | null => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as Product;
  } catch {
    return null;
  }
};

const parseURL = (value: string | null): shortURL | null => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as shortURL;
  } catch {
    return null;
  }
};

export const saveProduct = async (product: Product) => {
  await redisClient.hSet(PRODUCTS_KEY, product.id, JSON.stringify(product));
};

export const saveUrl = async (url: shortURL) => {
  await redisClient.hSet(URL_KEY, url.id, JSON.stringify(url));
};

export const getUrl = async (id: string) => {
  const url = await redisClient.hGet(URL_KEY, id);
  return parseURL(url);
};

export const getProduct = async (id: string) => {
  const value = await redisClient.hGet(PRODUCTS_KEY, id);
  return parseProduct(value);
};

export const listProducts = async () => {
  const values = await redisClient.hVals(PRODUCTS_KEY);
  const products: Product[] = [];
  for (const value of values) {
    const product = parseProduct(value);
    if (product) {
      products.push(product);
    }
  }
  return products;
};

export const addCartItem = async (productId: string) => {
  await redisClient.sAdd(CART_ITEMS_KEY, productId);
};

export const listCartItems = async () => {
  const ids = await redisClient.sMembers(CART_ITEMS_KEY);
  if (ids.length === 0) {
    return [];
  }
  const values = await redisClient.hmGet(PRODUCTS_KEY, ids);
  const items: Product[] = [];
  for (const value of values) {
    const product = parseProduct(value);
    if (product) {
      items.push(product);
    }
  }
  return items;
};
