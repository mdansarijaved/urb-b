import { redisClient } from "../config/redis.js";
import type { Product, shortURL } from "../types.js";

const URL_KEY = "shorturl";
const USER_RECONCILIATION_KEY = "user:reconciliation";
const IDENTIFIER_KEY = "identifier";
const USER_CACHE_TTL = 3600;

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

const parseJSON = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const saveUrl = async (url: shortURL) => {
  await redisClient.hSet(URL_KEY, url.id, JSON.stringify(url));
};

export const getUrl = async (id: string) => {
  const url = await redisClient.hGet(URL_KEY, id);
  return parseURL(url);
};

